import React from 'react';

const SettingsWrapper = ({ SettingsToggle, Settings, isEnabled, isVisible }) => (
  isEnabled ? (
    <div>
      <SettingsToggle />
      { isVisible && <Settings /> }
    </div>
  ) : null
)

export default SettingsWrapper;
