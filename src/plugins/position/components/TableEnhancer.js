import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getContext, mapProps, compose, withHandlers } from 'recompose';

import { setScrollPosition } from '../actions';

const Table = OriginalComponent => compose(
  getContext({
    selectors: PropTypes.object,
  }),
  connect((state, props) => {
      const { tableHeightSelector, tableWidthSelector } = props.selectors;
      return {
        TableHeight: tableHeightSelector(state),
        TableWidth: tableWidthSelector(state),
      };
    },
    {
      setScrollPosition,
    }
  ),
  mapProps((props) => {
    const { selectors, ...restProps } = props;
    return restProps;
  })
)(class extends Component {
  render() {
    const { TableHeight, TableWidth } = this.props;
    const scrollStyle = {
      'overflow': TableHeight && TableWidth ? 'scroll' : null,
      'overflowY' : TableHeight && !TableWidth ? 'scroll' : null,
      'overflowX' : !TableHeight && TableWidth ? 'scroll' : null,
      'height': TableHeight ? TableHeight : null,
      'width': TableWidth ? TableWidth : null,
      'display': 'inline-block'
    };

    return (
      <div ref={(ref) => this._scrollable = ref} style={scrollStyle} onScroll={this._scroll}>
        <OriginalComponent {...this.props}/>
      </div>
    );
  }

  _scroll = () => {
    const { setScrollPosition } = this.props;
    if (this._scrollable) {
      setScrollPosition(
        this._scrollable.scrollLeft,
        this._scrollable.scrollWidth,
        this._scrollable.clientWidth,
        this._scrollable.scrollTop,
        this._scrollable.scrollHeight,
        this._scrollable.clientHeight
      );
    }
  }
});

export default Table;
