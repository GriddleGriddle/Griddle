import React from 'react';

const SettingsWrapper = ({ SettingsToggle, Settings, isEnabled, isVisible, style, className }) => (
  isEnabled ? (
    <div style={style} className={className}>
      <SettingsToggle />
      { isVisible && <Settings /> }
    </div>
  ) : null
)

export default SettingsWrapper;
