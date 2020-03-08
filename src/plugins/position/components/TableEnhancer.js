import React, { Component, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from '../../../utils/griddleConnect';

import { setScrollPosition } from '../actions';
import GriddleContext from '../../../context/GriddleContext';

const Table = (OriginalComponent) =>
  connect(
    (state, props) => {
      const griddleContext = useContext(GriddleContext);
      const {
        tableHeightSelector,
        tableWidthSelector,
        rowHeightSelector
      } = griddleContext.selectors;
      return {
        TableHeight: tableHeightSelector(state),
        TableWidth: tableWidthSelector(state),
        RowHeight: rowHeightSelector(state)
      };
    },
    {
      setScrollPosition
    }
  )(
    class extends Component {
      constructor(props, context) {
        super(props, context);

        this.state = { scrollTop: 0 };
      }
      render() {
        const { TableHeight, TableWidth } = this.props;
        const scrollStyle = {
          overflow: TableHeight && TableWidth ? 'scroll' : null,
          overflowY: TableHeight && !TableWidth ? 'scroll' : null,
          overflowX: !TableHeight && TableWidth ? 'scroll' : null,
          height: TableHeight ? TableHeight : null,
          width: TableWidth ? TableWidth : null,
          display: 'inline-block'
        };

        return (
          <div ref={(ref) => (this._scrollable = ref)} style={scrollStyle} onScroll={this._scroll}>
            <OriginalComponent {...this.props} />
          </div>
        );
      }

      _scroll = () => {
        const { setScrollPosition, RowHeight } = this.props;
        const { scrollTop } = this.state;

        if (this._scrollable && Math.abs(this._scrollable.scrollTop - scrollTop) >= RowHeight) {
          setScrollPosition(
            this._scrollable.scrollLeft,
            this._scrollable.scrollWidth,
            this._scrollable.clientWidth,
            this._scrollable.scrollTop,
            this._scrollable.scrollHeight,
            this._scrollable.clientHeight
          );
          this.setState({ scrollTop: this._scrollable.scrollTop });
        }
      };
    }
  );

export default Table;
