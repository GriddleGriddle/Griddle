import React from 'react';
import { connect } from '../utils/griddleConnect';
import { getNext } from '../actions';

import { textSelector, hasNextSelector, classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/dataSelectors';

const enhance = OriginalComponent => connect((state, props) => ({
  text: textSelector(state, { key: 'next' }),
  hasNext: hasNextSelector(state, props),
  className: classNamesForComponentSelector(state, 'NextButton'),
  style: stylesForComponentSelector(state, 'NextButton'),
}),
  {
    getNext
  }
)((props) => <OriginalComponent {...props} onClick={props.getNext} />);

export default enhance;
