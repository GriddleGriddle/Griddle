import React from 'react';

const Pagination = ({
  Next,
  Previous,
  PageDropdown,
  style,
  className }) => (
    <div style={style} className={className}>
      {Previous && <Previous />}
      {PageDropdown && <PageDropdown /> }
      {Next && <Next /> }
    </div>
  );

export default Pagination;
