import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';

import { connect } from '../utils/griddleConnect';

const LoadingContainer = compose(
  getContext({
    components: PropTypes.object,
    selectors: PropTypes.object,
  }),
  connect(
    (state, props) => ({
      className: props.selectors.classNamesForComponentSelector(state, 'Loading'),
      style: props.selectors.stylesForComponentSelector(state, 'Loading'),
    })
  ),
  mapProps((props) => {
    const { components, ...otherProps } = props;
    return {
      Loading: components.Loading,
      ...otherProps
    };
  })
);

export default LoadingContainer;

