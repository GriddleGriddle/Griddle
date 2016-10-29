import React from 'react';
import { connect } from 'react-redux';

import { pageSizeSelector } from '../selectors/dataSelectors';
import { mapProps, compose, withState, withHandlers } from 'recompose';
import { setPageSize as setPageSizeAction } from '../actions';

const ComposedPageSizeSettings = compose(
  connect(
    (state) => ({
      pageSize: pageSizeSelector(state),
    }),
    {
      setPageSize: setPageSizeAction
    }
  ),
  withState('value', 'updateValue', ''),
  withHandlers({
    onChange: props => e => {
      props.updateValue(e.target.value)
    },
    onSave: props => e => {
      props.setPageSize(props.value)
    }
  }),
)(({ pageSize, onChange, onSave }) => (
  <div>
    <input type="text" onChange={onChange} defaultValue={pageSize} />
    <button type="button" onClick={onSave}>Save</button>
  </div>
))

export default ComposedPageSizeSettings;
