import React from 'react';

const SettingsWrapper = ({ SettingsToggle, Settings, isEnabled }) => (
  isEnabled ? (
    <div>
      <SettingsToggle />
      <Settings />
    </div>
  ) : null
)

export default SettingsWrapper;
