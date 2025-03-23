import { PhoneProvider, ProviderConfig } from './PhoneProvider';
import { TwilioProvider } from './TwilioProvider';
import { TelnyxProvider } from './TelnyxProvider';
import { BandwidthProvider } from './BandwidthProvider';

// Provider factory
export function createPhoneProvider(type: string, config: ProviderConfig): PhoneProvider {
  switch (type.toLowerCase()) {
    case 'twilio':
      return new TwilioProvider();
    case 'telnyx':
      return new TelnyxProvider();
    case 'bandwidth':
      return new BandwidthProvider();
    default:
      throw new Error(`Unknown provider type: ${type}`);
  }
}

export * from './PhoneProvider';
export * from './TwilioProvider';
export * from './TelnyxProvider';
export * from './BandwidthProvider';