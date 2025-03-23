import { PhoneProvider, ProviderConfig, SendSMSResult, CallResult, PhoneNumber, MessageStatus } from './PhoneProvider';

/**
 * Telnyx Provider Implementation
 * API Documentation: https://developers.telnyx.com/docs/api
 */
export class TelnyxProvider implements PhoneProvider {
  private client: any;
  private config: ProviderConfig;

  id = 'telnyx';
  name = 'Telnyx';
  logo = 'https://dallasreynoldstn.com/wp-content/uploads/2025/02/10522416.png';

  async initialize(config: ProviderConfig) {
    if (!config.apiKey) {
      throw new Error('Telnyx requires an API key');
    }
    this.config = config;
    this.client = require('telnyx')(config.apiKey);
  }

  async isInitialized(providerId: string): Promise<boolean> {
    if (providerId !== this.id) return false;
    if (!this.client || !this.config) return false;
    
    try {
      // Test API access by making a lightweight request
      await this.client.balance.retrieve();
      return true;
    } catch {
      return false;
    }
  }

  async sendSMS(to: string, message: string): Promise<SendSMSResult> {
    try {
      const result = await this.client.messages.create({
        from: this.config.phoneNumber,
        to,
        text: message,
        webhook_url: this.config.webhookUrl,
        use_profile_webhooks: true
      });

      return {
        messageId: result.id,
        status: {
          id: result.id,
          status: result.status,
          deliveredAt: result.completed_at,
          cost: result.cost
        }
      };
    } catch (error) {
      throw new Error(`Telnyx SMS Error: ${error.message}`);
    }
  }

  async makeCall(to: string, options?: any): Promise<CallResult> {
    try {
      const call = await this.client.calls.create({
        connection_id: this.config.connectionId,
        to,
        from: options?.callerId || this.config.phoneNumber,
        webhook_url: this.config.webhookUrl,
        answering_machine_detection: options?.machineDetection || false,
        record_audio: options?.recordingEnabled || false,
        timeout_secs: options?.timeout || 30
      });

      return {
        callId: call.call_control_id,
        status: call.state,
        direction: call.direction,
        duration: call.duration_sec,
        recordingUrl: call.recording_urls?.[0]
      };
    } catch (error) {
      throw new Error(`Telnyx Call Error: ${error.message}`);
    }
  }

  async listPhoneNumbers(): Promise<PhoneNumber[]> {
    try {
      const numbers = await this.client.phoneNumbers.list();
      return numbers.data.map(number => ({
        number: number.phone_number,
        formattedNumber: number.formatted_phone_number,
        capabilities: {
          voice: number.features.voice,
          sms: number.features.sms,
          mms: number.features.mms
        },
        monthlyPrice: 0.75,
        status: number.status
      }));
    } catch (error) {
      throw new Error(`Telnyx List Numbers Error: ${error.message}`);
    }
  }

  async purchasePhoneNumber(areaCode: string): Promise<PhoneNumber> {
    try {
      const availableNumbers = await this.client.availablePhoneNumbers.list({
        filter: {
          phone_number: { starts_with: `+1${areaCode}` },
          features: ['sms', 'voice', 'mms'],
          country_code: 'US'
        }
      });

      if (!availableNumbers.data.length) {
        throw new Error('No numbers available in this area code');
      }

      const number = await this.client.phoneNumbers.create({
        phone_number: availableNumbers.data[0].phone_number,
        connection_id: this.config.connectionId,
        messaging_profile_id: this.config.messagingProfileId
      });

      return {
        number: number.phone_number,
        formattedNumber: number.formatted_phone_number,
        capabilities: {
          voice: number.features.voice,
          sms: number.features.sms,
          mms: number.features.mms
        },
        monthlyPrice: 0.75,
        status: number.status
      };
    } catch (error) {
      throw new Error(`Telnyx Purchase Number Error: ${error.message}`);
    }
  }

  async releasePhoneNumber(phoneNumber: string): Promise<void> {
    try {
      const numbers = await this.client.phoneNumbers.list({
        filter: { phone_number: phoneNumber }
      });

      if (!numbers.data.length) {
        throw new Error('Phone number not found');
      }

      await this.client.phoneNumbers.delete(numbers.data[0].id);
    } catch (error) {
      throw new Error(`Telnyx Release Number Error: ${error.message}`);
    }
  }

  async handleIncomingCall(callData: any): Promise<void> {
    const { call_control_id } = callData.data.payload;

    try {
      // Example IVR flow
      await this.client.calls.answer(call_control_id);
      await this.client.calls.playback_start(call_control_id, {
        audio_url: this.config.welcomeMessageUrl
      });
    } catch (error) {
      throw new Error(`Telnyx Call Handling Error: ${error.message}`);
    }
  }

  async endCall(callId: string): Promise<void> {
    try {
      await this.client.calls.hangup(callId);
    } catch (error) {
      throw new Error(`Telnyx End Call Error: ${error.message}`);
    }
  }

  async muteCall(callId: string, muted: boolean): Promise<void> {
    try {
      if (muted) {
        await this.client.calls.playback_stop(callId);
      }
    } catch (error) {
      throw new Error(`Telnyx Mute Call Error: ${error.message}`);
    }
  }

  async getMessageStatus(messageId: string): Promise<MessageStatus> {
    try {
      const message = await this.client.messages.retrieve(messageId);
      return {
        id: message.id,
        status: message.status,
        deliveredAt: message.completed_at,
        cost: message.cost
      };
    } catch (error) {
      throw new Error(`Telnyx Message Status Error: ${error.message}`);
    }
  }

  async getMessageHistory(phoneNumber: string): Promise<any[]> {
    try {
      const messages = await this.client.messages.list({
        filter: {
          from: this.config.phoneNumber,
          to: phoneNumber
        },
        page: { size: 50 }
      });

      return messages.data.map(msg => ({
        id: msg.id,
        content: msg.text,
        direction: msg.direction,
        status: msg.status,
        timestamp: msg.sent_at,
        cost: msg.cost
      }));
    } catch (error) {
      throw new Error(`Telnyx Message History Error: ${error.message}`);
    }
  }
}