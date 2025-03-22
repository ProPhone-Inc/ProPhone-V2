export interface PhoneProvider {
  id: string;
  name: string;
  logo: string;
  
  // Core functionality
  initialize(config: ProviderConfig): Promise<void>;
  sendSMS(to: string, message: string): Promise<SendSMSResult>;
  makeCall(to: string, options?: CallOptions): Promise<CallResult>;
  
  // Phone number management
  listPhoneNumbers(): Promise<PhoneNumber[]>;
  purchasePhoneNumber(areaCode: string): Promise<PhoneNumber>;
  releasePhoneNumber(phoneNumber: string): Promise<void>;
  
  // Call handling
  handleIncomingCall(callData: any): Promise<void>;
  endCall(callId: string): Promise<void>;
  muteCall(callId: string, muted: boolean): Promise<void>;
  
  // Messaging
  getMessageStatus(messageId: string): Promise<MessageStatus>;
  getMessageHistory(phoneNumber: string): Promise<Message[]>;
}

export interface ProviderConfig {
  apiKey: string;
  apiSecret?: string;
  accountSid?: string;
  region?: string;
  [key: string]: any;
}

export interface PhoneNumber {
  number: string;
  formattedNumber: string;
  capabilities: {
    voice: boolean;
    sms: boolean;
    mms: boolean;
  };
  monthlyPrice: number;
  status: 'active' | 'pending' | 'released';
}

export interface SendSMSResult {
  messageId: string;
  status: MessageStatus;
  cost?: number;
}

export interface MessageStatus {
  id: string;
  status: 'queued' | 'sending' | 'sent' | 'delivered' | 'failed';
  error?: string;
  deliveredAt?: Date;
  cost?: number;
}

export interface CallOptions {
  callerId?: string;
  recordingEnabled?: boolean;
  transcriptionEnabled?: boolean;
  timeout?: number;
  machineDetection?: boolean;
}

export interface CallResult {
  callId: string;
  status: 'initiated' | 'ringing' | 'in-progress' | 'completed' | 'failed';
  direction: 'inbound' | 'outbound';
  duration?: number;
  recordingUrl?: string;
  transcriptionText?: string;
}