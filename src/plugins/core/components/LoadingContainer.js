import PropTypes from 'prop-types';
import { connect } from '../../../utils/griddleConnect';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';

import { classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/dataSelectors';

const LoadingContainer = compose(
  getContext({
    components: PropTypes.object,
  }),
  connect(
    state => ({
      className: classNamesForComponentSelector(state, 'Loading'),
      style: stylesForComponentSelector(state, 'Loading'),
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

