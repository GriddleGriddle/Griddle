import React from 'react';

const Pagination = ({ getPrevious,
  getNext,
  setPage,
  maxPages,
  currentPage,
  hasNext,
  hasPrevious,
  Next=null,
  Previous=null,
  PageDropdown=null,
  style,
  className }) => (
    <div style={style} className={className}>
      {Previous && <Previous />}
      {PageDropdown && <PageDropdown
        maxPages={maxPages}
        currentPage={currentPage}
        setPage={setPage}
      /> }
      {Next && <Next /> }
    </div>
  );

export default Pagination;
