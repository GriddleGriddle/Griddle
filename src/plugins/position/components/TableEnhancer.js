import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from '../../../utils/griddleConnect';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';

import { setScrollPosition } from '../actions';

const Table = OriginalComponent => compose(
  getContext({
    selectors: PropTypes.object,
  }),
  connect((state, props) => {
      const { tableHeightSelector, tableWidthSelector, rowHeightSelector } = props.selectors;
      return {
        TableHeight: tableHeightSelector(state),
        TableWidth: tableWidthSelector(state),
        RowHeight: rowHeightSelector(state),
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
  constructor(props, context) {
    super(props, context);

    this.state = { scrollTop: 0 };
  }
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
  }
});

export default Table;
