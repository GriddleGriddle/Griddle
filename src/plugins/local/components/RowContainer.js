import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getContext, mapProps, compose, withHandlers } from 'recompose';
import { columnIdsSelector } from '../selectors/localSelectors';

const Override = Original => class extends React.Component {
  contextTypes: {
    components: React.PropTypes.object
  }

  render() {
    debugger;
    return <tr><td>Yo</td></tr>
  }
}

const ComposedRowContainer = OriginalComponent => compose(
  getContext({
    components: PropTypes.object
  }),
  connect((state) => ({
    columnIds: columnIdsSelector(state)
  })),
  withHandlers({
    Cell: props => props.components.Cell
  })
)(({Cell, columnIds, griddleKey}) => (
  <OriginalComponent
    griddleKey={griddleKey}
    columnIds={columnIds}
    Cell={Cell}
  />
));

export default Override;