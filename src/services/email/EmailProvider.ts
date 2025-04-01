import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { simpleParser } from 'mailparser';
import * as ImapSimple from 'imap-simple';
import nodemailer from 'nodemailer';

export interface EmailMessage {
  id: string;
  from: string;
  to: string[];
  subject: string;
  body: string;
  date: Date;
  read: boolean;
  starred: boolean;
  labels: string[];
  attachments: Array<{
    filename: string;
    contentType: string;
    size: number;
    content?: Buffer;
  }>;
}

export interface EmailProvider {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getMessages(folder: string, page: number, limit: number): Promise<EmailMessage[]>;
  getMessage(id: string): Promise<EmailMessage>;
  sendMessage(to: string[], subject: string, body: string, attachments?: File[]): Promise<void>;
  markAsRead(id: string): Promise<void>;
  markAsUnread(id: string): Promise<void>;
  toggleStar(id: string): Promise<void>;
  moveToTrash(id: string): Promise<void>;
  addLabel(id: string, label: string): Promise<void>;
  removeLabel(id: string, label: string): Promise<void>;
}

export class GmailProvider implements EmailProvider {
  private auth: OAuth2Client;
  private gmail: any;
  private email: string;

  constructor(email: string, clientId: string, clientSecret: string) {
    this.email = email;
    this.auth = new OAuth2Client({
      clientId,
      clientSecret,
      redirectUri: window.location.origin + '/auth/callback'
    });
  }

  async connect(): Promise<void> {
    try {
      const token = localStorage.getItem(`gmail_token_${this.email}`);
      if (token) {
        this.auth.setCredentials(JSON.parse(token));
      } else {
        const url = this.auth.generateAuthUrl({
          access_type: 'offline',
          scope: ['https://www.googleapis.com/auth/gmail.modify']
        });
        window.location.href = url;
      }

      // Initialize gmail API client
      try {
        this.gmail = google.gmail({ version: 'v1', auth: this.auth });
      } catch (error) {
        console.error('Failed to initialize Gmail client:', error);
      }
    } catch (error) {
      console.error('Gmail connection error:', error);
      throw new Error('Failed to connect to Gmail');
    }
  }

  async disconnect(): Promise<void> {
    localStorage.removeItem(`gmail_token_${this.email}`);
    this.auth = null;
    this.gmail = null;
  }

  async getMessages(folder: string, page: number = 1, limit: number = 50): Promise<EmailMessage[]> {
    try {
      const labelId = this.getFolderId(folder);
      const res = await this.gmail.users.messages.list({
        userId: 'me',
        labelIds: [labelId],
        maxResults: limit,
        pageToken: page > 1 ? String(page) : undefined
      });

      const messages = await Promise.all(
        res.data.messages.map(async (msg: any) => {
          const fullMsg = await this.gmail.users.messages.get({
            userId: 'me',
            id: msg.id,
            format: 'full'
          });

          return this.parseGmailMessage(fullMsg.data);
        })
      );

      return messages;
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      throw new Error('Failed to fetch messages');
    }
  }

  private getFolderId(folder: string): string {
    const folderMap: Record<string, string> = {
      'inbox': 'INBOX',
      'sent': 'SENT',
      'drafts': 'DRAFT',
      'trash': 'TRASH',
      'spam': 'SPAM',
      'starred': 'STARRED'
    };
    return folderMap[folder] || folder;
  }

  private parseGmailMessage(msg: any): EmailMessage {
    const headers = msg.payload.headers;
    const getHeader = (name: string) => headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value;

    return {
      id: msg.id,
      from: getHeader('from'),
      to: (getHeader('to') || '').split(',').map((e: string) => e.trim()),
      subject: getHeader('subject'),
      body: this.getMessageBody(msg.payload),
      date: new Date(parseInt(msg.internalDate)),
      read: !msg.labelIds.includes('UNREAD'),
      starred: msg.labelIds.includes('STARRED'),
      labels: msg.labelIds,
      attachments: this.getAttachments(msg.payload)
    };
  }

  private getMessageBody(payload: any): string {
    if (payload.body.data) {
      return Buffer.from(payload.body.data, 'base64').toString();
    }

    if (payload.parts) {
      for (const part of payload.parts) {
        if (part.mimeType === 'text/plain' || part.mimeType === 'text/html') {
          return Buffer.from(part.body.data, 'base64').toString();
        }
      }
    }

    return '';
  }

  private getAttachments(payload: any): any[] {
    const attachments: any[] = [];

    const processPayload = (part: any) => {
      if (part.filename && part.body.attachmentId) {
        attachments.push({
          filename: part.filename,
          contentType: part.mimeType,
          size: part.body.size,
          attachmentId: part.body.attachmentId
        });
      }
      if (part.parts) {
        part.parts.forEach(processPayload);
      }
    };

    processPayload(payload);
    return attachments;
  }

  async getMessage(id: string): Promise<EmailMessage> {
    try {
      const res = await this.gmail.users.messages.get({
        userId: 'me',
        id: id,
        format: 'full'
      });

      return this.parseGmailMessage(res.data);
    } catch (error) {
      console.error('Failed to fetch message:', error);
      throw new Error('Failed to fetch message');
    }
  }

  async sendMessage(to: string[], subject: string, body: string, attachments?: File[]): Promise<void> {
    try {
      const message = await this.createMimeMessage(to, subject, body, attachments);
      
      await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: Buffer.from(message).toString('base64url')
        }
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      throw new Error('Failed to send message');
    }
  }

  private async createMimeMessage(to: string[], subject: string, body: string, attachments?: File[]): Promise<string> {
    const message: string[] = [
      `From: ${this.email}`,
      `To: ${to.join(', ')}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${subject}`,
      '',
      body
    ];

    if (attachments?.length) {
      const boundary = `boundary_${Math.random().toString(36).substr(2)}`;
      message.unshift(`Content-Type: multipart/mixed; boundary="${boundary}"`);
      
      for (const file of attachments) {
        const content = await file.arrayBuffer();
        const base64Data = Buffer.from(content).toString('base64');
        
        message.push(
          `--${boundary}`,
          `Content-Type: ${file.type}`,
          'Content-Transfer-Encoding: base64',
          `Content-Disposition: attachment; filename="${file.name}"`,
          '',
          base64Data
        );
      }
      
      message.push(`--${boundary}--`);
    }

    return message.join('\r\n');
  }

  async markAsRead(id: string): Promise<void> {
    await this.modifyMessage(id, { removeLabelIds: ['UNREAD'] });
  }

  async markAsUnread(id: string): Promise<void> {
    await this.modifyMessage(id, { addLabelIds: ['UNREAD'] });
  }

  async toggleStar(id: string): Promise<void> {
    const msg = await this.getMessage(id);
    if (msg.starred) {
      await this.modifyMessage(id, { removeLabelIds: ['STARRED'] });
    } else {
      await this.modifyMessage(id, { addLabelIds: ['STARRED'] });
    }
  }

  async moveToTrash(id: string): Promise<void> {
    await this.modifyMessage(id, { addLabelIds: ['TRASH'] });
  }

  async addLabel(id: string, label: string): Promise<void> {
    await this.modifyMessage(id, { addLabelIds: [label] });
  }

  async removeLabel(id: string, label: string): Promise<void> {
    await this.modifyMessage(id, { removeLabelIds: [label] });
  }

  private async modifyMessage(id: string, modifications: { 
    addLabelIds?: string[],
    removeLabelIds?: string[] 
  }): Promise<void> {
    try {
      await this.gmail.users.messages.modify({
        userId: 'me',
        id: id,
        requestBody: modifications
      });
    } catch (error) {
      console.error('Failed to modify message:', error);
      throw new Error('Failed to modify message');
    }
  }
}