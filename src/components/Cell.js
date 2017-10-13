import React, { Component } from 'react';

const Cell = (props) => {
  const {
    value,
    customComponent: CustomComponent,
    cellProperties,
    onClick,
    onMouseEnter,
    onMouseLeave,
    style,
    className,
  } = props;
  return (
    <td
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={style}
      className={className}
    >
      {CustomComponent ? <CustomComponent {...props} /> : value}
    </td>
  );
}

export default Cell;
