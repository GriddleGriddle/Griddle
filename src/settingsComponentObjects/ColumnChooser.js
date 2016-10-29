import React from 'react';
import { connect } from 'react-redux';

import { visibleColumnPropertiesSelector, hiddenColumnsSelector } from '../selectors/dataSelectors';
import { mapProps, compose, withState, withHandlers } from 'recompose';
import { setVisibleColumns as setVisibleColumnsAction } from  '../actions';

const ComposedColumnSettings = compose(
  connect(
    (state) => ({
      visibleColumns: visibleColumnPropertiesSelector(state),
      hiddenColumns: hiddenColumnsSelector(state)
    }),
    {
      setColumns: setVisibleColumnsAction
    }
  )
)(({ visibleColumns, hiddenColumns }) => { debugger; 
debugger; return (
  <div>
    { Object.keys(visibleColumns).map(v => <label htmlFor={visibleColumns[v].id}><input type="checkbox" name={visibleColumns[v].id} checked />{visibleColumns[v].title || visibleColumns[v].id}</label>)}
    { hiddenColumns.map(v => <label htmlFor={v.id}><input type="checkbox" name={v.id} />{v.title}</label>)}
  </div>
)});

export default ComposedColumnSettings;
