import React from 'react';

// This is responsible for rendering the individual settings sections
const Settings = ({ settingsComponents, style, className }) => (
  <div style={style} className={className}>
    {settingsComponents && settingsComponents.map((SettingsComponent, i) => SettingsComponent && <div key={SettingsComponent.key || i}><SettingsComponent /></div>)}
  </div>
)

export default Settings;
