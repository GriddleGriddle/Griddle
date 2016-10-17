import React from 'react';

const Pagination = ({ getPrevious, getNext, getPage, maxPages, hasNext, hasPrevious }) => {
  return (
  <div>
    { hasPrevious && <button type="button" onClick={getPrevious}>Previous</button> }
    { hasNext && <button type="button" onClick={getNext}>Next</button>}
  </div>
);
}

export default Pagination;
