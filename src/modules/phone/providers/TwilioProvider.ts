import { PhoneProvider, ProviderConfig, SendSMSResult, CallResult, PhoneNumber, MessageStatus } from './PhoneProvider';

/**
 * Twilio Provider Implementation
 * API Documentation: https://www.twilio.com/docs/api
 */
export class TwilioProvider implements PhoneProvider {
  private client: any;
  private config: ProviderConfig;

  id = 'twilio';
  name = 'Twilio';
  logo = 'https://www.twilio.com/assets/icons/twilio-icon.svg';

  async initialize(config: ProviderConfig) {
    if (!config.accountSid || !config.authToken) {
      throw new Error('Twilio requires accountSid and authToken');
    }
    this.config = config;
    this.client = require('twilio')(config.accountSid, config.authToken);
  }

  async isInitialized(providerId: string): Promise<boolean> {
    if (providerId !== this.id) return false;
    if (!this.client || !this.config) return false;
    
    try {
      // Test API access by making a lightweight request
      await this.client.api.accounts(this.config.accountSid).fetch();
      return true;
    } catch {
      return false;
    }
  }

  async sendSMS(to: string, message: string): Promise<SendSMSResult> {
    try {
      const result = await this.client.messages.create({
        to,
        from: this.config.phoneNumber,
        body: message,
        statusCallback: this.config.statusCallbackUrl
      });

      return {
        messageId: result.sid,
        status: {
          id: result.sid,
          status: result.status,
          deliveredAt: result.dateCreated,
          cost: result.price
        }
      };
    } catch (error) {
      throw new Error(`Twilio SMS Error: ${error.message}`);
    }
  }

  async makeCall(to: string, options?: any): Promise<CallResult> {
    try {
      const call = await this.client.calls.create({
        to,
        from: options?.callerId || this.config.phoneNumber,
        url: this.config.voiceUrl,
        statusCallback: this.config.statusCallbackUrl,
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
        statusCallbackMethod: 'POST',
        machineDetection: options?.machineDetection ? 'Enable' : 'Disable',
        timeout: options?.timeout || 30
      });

      return {
        callId: call.sid,
        status: call.status,
        direction: call.direction,
        duration: call.duration,
        recordingUrl: call.recordingUrl
      };
    } catch (error) {
      throw new Error(`Twilio Call Error: ${error.message}`);
    }
  }

  async listPhoneNumbers(): Promise<PhoneNumber[]> {
    try {
      const numbers = await this.client.incomingPhoneNumbers.list();
      return numbers.map(number => ({
        number: number.phoneNumber,
        formattedNumber: number.friendlyName,
        capabilities: {
          voice: number.capabilities.voice,
          sms: number.capabilities.sms,
          mms: number.capabilities.mms
        },
        monthlyPrice: number.addressRequirements === 'none' ? 1.00 : 2.00,
        status: 'active'
      }));
    } catch (error) {
      throw new Error(`Twilio List Numbers Error: ${error.message}`);
    }
  }

  async purchasePhoneNumber(areaCode: string): Promise<PhoneNumber> {
    try {
      const availableNumbers = await this.client.availablePhoneNumbers('US')
        .local.list({ areaCode, limit: 1 });

      if (!availableNumbers.length) {
        throw new Error('No numbers available in this area code');
      }

      const number = await this.client.incomingPhoneNumbers.create({
        phoneNumber: availableNumbers[0].phoneNumber,
        voiceUrl: this.config.voiceUrl,
        smsUrl: this.config.smsUrl
      });

      return {
        number: number.phoneNumber,
        formattedNumber: number.friendlyName,
        capabilities: {
          voice: number.capabilities.voice,
          sms: number.capabilities.sms,
          mms: number.capabilities.mms
        },
        monthlyPrice: number.addressRequirements === 'none' ? 1.00 : 2.00,
        status: 'active'
      };
    } catch (error) {
      throw new Error(`Twilio Purchase Number Error: ${error.message}`);
    }
  }

  async releasePhoneNumber(phoneNumber: string): Promise<void> {
    try {
      const numbers = await this.client.incomingPhoneNumbers.list({
        phoneNumber
      });

      if (numbers.length === 0) {
        throw new Error('Phone number not found');
      }

      await this.client.incomingPhoneNumbers(numbers[0].sid).remove();
    } catch (error) {
      throw new Error(`Twilio Release Number Error: ${error.message}`);
    }
  }

  async handleIncomingCall(callData: any): Promise<void> {
    const twiml = new (require('twilio').twiml.VoiceResponse)();

    // Example IVR flow
    twiml.gather({
      numDigits: 1,
      action: '/voice/handle-input',
      method: 'POST'
    }).say('Press 1 for sales, 2 for support, or stay on the line for the operator.');

    twiml.redirect('/voice/operator');
  }

  async endCall(callId: string): Promise<void> {
    try {
      await this.client.calls(callId).update({ status: 'completed' });
    } catch (error) {
      throw new Error(`Twilio End Call Error: ${error.message}`);
    }
  }

  async muteCall(callId: string, muted: boolean): Promise<void> {
    try {
      await this.client.calls(callId).update({ muted });
    } catch (error) {
      throw new Error(`Twilio Mute Call Error: ${error.message}`);
    }
  }

  async getMessageStatus(messageId: string): Promise<MessageStatus> {
    try {
      const message = await this.client.messages(messageId).fetch();
      return {
        id: message.sid,
        status: message.status,
        deliveredAt: message.dateUpdated,
        cost: message.price
      };
    } catch (error) {
      throw new Error(`Twilio Message Status Error: ${error.message}`);
    }
  }

  async getMessageHistory(phoneNumber: string): Promise<any[]> {
    try {
      const messages = await this.client.messages.list({
        to: phoneNumber,
        from: this.config.phoneNumber,
        limit: 50
      });

      return messages.map(msg => ({
        id: msg.sid,
        content: msg.body,
        direction: msg.direction,
        status: msg.status,
        timestamp: msg.dateCreated,
        cost: msg.price
      }));
    } catch (error) {
      throw new Error(`Twilio Message History Error: ${error.message}`);
    }
  }
}