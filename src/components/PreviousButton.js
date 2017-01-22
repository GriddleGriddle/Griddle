import React from 'react';

const PreviousButton = ({ hasPrevious, onClick, style, className, text }) => hasPrevious ? (
  <button type="button" onClick={onClick} style={style} className={className}>{text}</button>
) :
null;

export default PreviousButton;
