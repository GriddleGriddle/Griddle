import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose, mapProps, getContext } from 'recompose';
import { hasNextSelector, classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/dataSelectors';

const enhance = OriginalComponent => compose(
  getContext({
    events: PropTypes.object
  }),
  mapProps(({ events: { onNext }, ...props }) => ({
    ...props,
    onClick: (...args) => [props.onClick, onNext].forEach(func => func(args)),
  }))
)((props) => <OriginalComponent {...props} />);

export default enhance;
