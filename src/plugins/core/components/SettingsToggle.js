import React from 'react';

const SettingsToggle = ({onClick, text, style, className}) => (
  <button
    onClick={onClick}
    type="button"
    style={style}
    className={className}
  >
    {text}
  </button>
);

export default SettingsToggle;
