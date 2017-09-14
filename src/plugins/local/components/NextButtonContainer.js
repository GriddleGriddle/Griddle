import React from 'react';
import { connect } from '../../../utils/griddleConnect';

import { textSelector, hasNextSelector, classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/localSelectors';
import { getNext } from '../../../actions';

const enhance = OriginalComponent => connect(state => ({
  text: textSelector(state, { key: 'next' }),
  hasNext: hasNextSelector(state),
  className: classNamesForComponentSelector(state, 'NextButton'),
  style: stylesForComponentSelector(state, 'NextButton'),
}),
  {
    getNext
  }
)(props => <OriginalComponent {...props} onClick={props.getNext} />);

export default enhance;
