import React from 'react';

const Settings = ({ settingsComponents }) => (
  <div>
    {settingsComponents.map((SettingsComponent) => <div><SettingsComponent /></div>)}
  </div>
)

export default Settings;
