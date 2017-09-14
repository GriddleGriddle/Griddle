import React from 'react';

// This is a component that wraps all of the other settings components ( SettingsToggle, Settings, etc).
// All of the settings views will be hiddne if isEnabled = false
const SettingsWrapper = ({ SettingsToggle, Settings, isEnabled, isVisible, style, className }) => (
  isEnabled ? (
    <div style={style} className={className}>
      { SettingsToggle && <SettingsToggle /> }
      { isVisible && <Settings /> }
    </div>
  ) : null
)

export default SettingsWrapper;
