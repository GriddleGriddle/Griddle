import React from 'react';

const SettingsToggle = ({onClick, text}) => (
  <button
    onClick={onClick}
    type="button"
  >
    {text}
  </button>
);

export default SettingsToggle;
