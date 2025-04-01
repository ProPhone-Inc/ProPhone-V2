import { PhoneProvider, ProviderConfig, SendSMSResult, CallResult, PhoneNumber, MessageStatus } from './PhoneProvider';

/**
 * Bandwidth Provider Implementation
 * API Documentation: https://dev.bandwidth.com/apis/voice
 */
export class BandwidthProvider implements PhoneProvider {
  private client: any;
  private config: ProviderConfig;

  id = 'bandwidth';
  name = 'Bandwidth';
  logo = 'https://www.bandwidth.com/wp-content/themes/bandwidth/favicon/favicon-32x32.png';

  async initialize(config: ProviderConfig) {
    if (!config.accountId || !config.apiToken || !config.apiSecret) {
      throw new Error('Bandwidth requires accountId, apiToken, and apiSecret');
    }
    this.config = config;
    this.client = require('@bandwidth/messaging').Client({
      userId: config.accountId,
      apiToken: config.apiToken,
      apiSecret: config.apiSecret
    });
  }

  async isInitialized(providerId: string): Promise<boolean> {
    if (providerId !== this.id) return false;
    if (!this.client || !this.config) return false;
    
    try {
      // Test API access by making a lightweight request
      await this.client.account.get();
      return true;
    } catch {
      return false;
    }
  }

  async sendSMS(to: string, message: string): Promise<SendSMSResult> {
    try {
      const result = await this.client.message.send({
        from: this.config.phoneNumber,
        to: [to],
        text: message,
        applicationId: this.config.applicationId,
        tag: 'marketing'
      });

      return {
        messageId: result.id,
        status: {
          id: result.id,
          status: result.status,
          deliveredAt: result.time,
          cost: result.price
        }
      };
    } catch (error) {
      throw new Error(`Bandwidth SMS Error: ${error.message}`);
    }
  }

  async makeCall(to: string, options?: any): Promise<CallResult> {
    try {
      const call = await this.client.call.create({
        from: options?.callerId || this.config.phoneNumber,
        to,
        answerUrl: this.config.answerUrl,
        applicationId: this.config.applicationId,
        tag: options?.tag || 'outbound',
        recordingEnabled: options?.recordingEnabled || false,
        transcriptionEnabled: options?.transcriptionEnabled || false
      });

      return {
        callId: call.callId,
        status: call.status,
        direction: 'outbound',
        duration: call.duration,
        recordingUrl: call.recordingUrl,
        transcriptionText: call.transcription
      };
    } catch (error) {
      throw new Error(`Bandwidth Call Error: ${error.message}`);
    }
  }

  async listPhoneNumbers(): Promise<PhoneNumber[]> {
    try {
      const numbers = await this.client.phoneNumber.list();
      return numbers.map(number => ({
        number: number.number,
        formattedNumber: number.nationalNumber,
        capabilities: {
          voice: number.features.includes('voice'),
          sms: number.features.includes('sms'),
          mms: number.features.includes('mms')
        },
        monthlyPrice: 0.85,
        status: number.status.toLowerCase()
      }));
    } catch (error) {
      throw new Error(`Bandwidth List Numbers Error: ${error.message}`);
    }
  }

  async purchasePhoneNumber(areaCode: string): Promise<PhoneNumber> {
    try {
      const availableNumbers = await this.client.phoneNumber.search({
        areaCode,
        quantity: 1,
        state: 'CA'
      });

      if (!availableNumbers.phoneNumberList.length) {
        throw new Error('No numbers available in this area code');
      }

      const number = await this.client.phoneNumber.create({
        name: 'Main Line',
        siteId: this.config.siteId,
        phoneNumbers: availableNumbers.phoneNumberList
      });

      return {
        number: number.number,
        formattedNumber: number.nationalNumber,
        capabilities: {
          voice: number.features.includes('voice'),
          sms: number.features.includes('sms'),
          mms: number.features.includes('mms')
        },
        monthlyPrice: 0.85,
        status: 'active'
      };
    } catch (error) {
      throw new Error(`Bandwidth Purchase Number Error: ${error.message}`);
    }
  }

  async releasePhoneNumber(phoneNumber: string): Promise<void> {
    try {
      await this.client.phoneNumber.delete(phoneNumber);
    } catch (error) {
      throw new Error(`Bandwidth Release Number Error: ${error.message}`);
    }
  }

  async handleIncomingCall(callData: any): Promise<void> {
    try {
      const response = new this.client.Response();
      
      // Example IVR flow
      const gather = response.createGather({
        maxDigits: 1,
        gatherUrl: '/voice/handle-input'
      });

      gather.speakSentence({
        sentence: 'Press 1 for sales, 2 for support, or stay on the line for the operator.',
        voice: 'julie'
      });

      response.redirect('/voice/operator');

      return response.toBxml();
    } catch (error) {
      throw new Error(`Bandwidth Call Handling Error: ${error.message}`);
    }
  }

  async endCall(callId: string): Promise<void> {
    try {
      await this.client.call.hangup(callId);
    } catch (error) {
      throw new Error(`Bandwidth End Call Error: ${error.message}`);
    }
  }

  async muteCall(callId: string, muted: boolean): Promise<void> {
    try {
      await this.client.call.update(callId, { muted });
    } catch (error) {
      throw new Error(`Bandwidth Mute Call Error: ${error.message}`);
    }
  }

  async getMessageStatus(messageId: string): Promise<MessageStatus> {
    try {
      const message = await this.client.message.get(messageId);
      return {
        id: message.id,
        status: message.status,
        deliveredAt: message.time,
        cost: message.price
      };
    } catch (error) {
      throw new Error(`Bandwidth Message Status Error: ${error.message}`);
    }
  }

  async getMessageHistory(phoneNumber: string): Promise<any[]> {
    try {
      const messages = await this.client.message.list({
        from: this.config.phoneNumber,
        to: phoneNumber,
        limit: 50
      });

      return messages.map(msg => ({
        id: msg.id,
        content: msg.text,
        direction: msg.direction,
        status: msg.status,
        timestamp: msg.time,
        cost: msg.price
      }));
    } catch (error) {
      throw new Error(`Bandwidth Message History Error: ${error.message}`);
    }
  }
}