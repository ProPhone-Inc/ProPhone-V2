import { PhoneProvider, ProviderConfig } from './PhoneProvider';
import { TwilioProvider } from './TwilioProvider';
import { TelnyxProvider } from './TelnyxProvider';

// Provider factory
export function createPhoneProvider(type: string, config: ProviderConfig): PhoneProvider {
  switch (type.toLowerCase()) {
    case 'twilio':
      return new TwilioProvider();
    case 'telnyx':
      return new TelnyxProvider();
    default:
      throw new Error(`Unknown provider type: ${type}`);
  }
}

export * from './PhoneProvider';
export * from './TwilioProvider';