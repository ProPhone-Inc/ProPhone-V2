import React from 'react';
import { SettingsLayout } from './SettingsLayout';
import { ProfileSection } from './ProfileSection';
import { BillingSection } from './BillingSection';

export function Settings() {
  return (
    <SettingsLayout>
      <ProfileSection />
      <BillingSection />
    </SettingsLayout>
  );
}