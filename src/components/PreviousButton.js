import React from 'react';

const NextButton = ({ hasNext, onClick, style, className, text }) => hasNext ? (
  <button type="button" onClick={onClick} style={style} className={className}>{text}</button>
) :
null;

export default NextButton;
