import React from 'react';

const Settings = ({ settingsComponents, style, className }) => (
  <div style={style} className={className}>
    {settingsComponents.map((SettingsComponent) => <div><SettingsComponent /></div>)}
  </div>
)

export default Settings;
