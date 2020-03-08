import React, { useState } from 'react';
import { connect } from '../utils/griddleConnect';

import { pageSizeSelector } from '../selectors/dataSelectors';

import { setPageSize as setPageSizeAction } from '../actions';

const ComposedPageSizeSettings = ({ pageSize, setPageSize }) => {
  const [value, setValue] = useState('');
  const onChange = (e) => {
    setValue(e.target.value);
  };
  const onSave = () => {
    setPageSize(value);
  };
  return (
    <div>
      <input type="text" onChange={onChange} defaultValue={pageSize} />
      <button type="button" onClick={onSave}>
        Save
      </button>
    </div>
  );
};

export default connect(
  (state) => ({
    pageSize: pageSizeSelector(state)
  }),
  {
    setPageSize: setPageSizeAction
  }
)(ComposedPageSizeSettings);
