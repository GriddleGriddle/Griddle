import React from 'react';
import { connect } from '../utils/griddleConnect';

import {
  visibleColumnPropertiesSelector,
  hiddenColumnPropertiesSelector
} from '../selectors/dataSelectors';
import { toggleColumn as toggleColumnAction } from '../actions';

const style = {
  label: { clear: 'both' }
};

const ComposedColumnSettings = ({ visibleColumns, hiddenColumns, toggleColumn }) => {
  const onToggle = (event) => {
    toggleColumn(event.target.name);
  };
  return (
    <div>
      <div>
        <h4>Visible Columns</h4>
        {Object.keys(visibleColumns).map((v) => (
          <label htmlFor={visibleColumns[v].id} key={visibleColumns[v].id} style={style.label}>
            <input type="checkbox" name={visibleColumns[v].id} checked onChange={onToggle} />
            {visibleColumns[v].title || visibleColumns[v].id}
          </label>
        ))}
      </div>
      <div>
        <h4>Hidden Columns</h4>
        {Object.keys(hiddenColumns).map((v) => (
          <label key={hiddenColumns[v].id} htmlFor={hiddenColumns[v].id} style={style.label}>
            <input
              type="checkbox"
              name={hiddenColumns[v].id}
              onChange={onToggle}
              defaultChecked={false}
            />
            {hiddenColumns[v].title || hiddenColumns[v].id}
          </label>
        ))}
      </div>
    </div>
  );
};

export default connect(
  (state) => ({
    visibleColumns: visibleColumnPropertiesSelector(state),
    hiddenColumns: hiddenColumnPropertiesSelector(state)
  }),
  {
    toggleColumn: toggleColumnAction
  }
)(ComposedColumnSettings);
