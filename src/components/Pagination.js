import React from 'react';
import PageDropdown from './PageDropdown';

const Pagination = ({ getPrevious, getNext, setPage, maxPages, currentPage, hasNext, hasPrevious }) => {
  return (
    <div>
      { hasPrevious && <button type="button" onClick={getPrevious}>Previous</button> }
      <PageDropdown
        maxPages={maxPages}
        currentPage={currentPage}
        setPage={setPage}
      />
      { hasNext && <button type="button" onClick={getNext}>Next</button>}
    </div>
  );
}

export default Pagination;
