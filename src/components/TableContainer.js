import React from 'react';

//TODO: adjust the import so we're not pulling in the whole library here'
import { getContext, mapProps, compose } from 'recompose';

const ComposedContainerComponent = OriginalComponent => compose(
  getContext(
  {
    components: React.PropTypes.object
  }),
  mapProps(props => ({
    TableHeading: props.components.TableHeading,
    TableBody: props.components.TableBody,
  }))
)(({TableHeading, TableBody}) => <OriginalComponent TableHeading={TableHeading} TableBody={TableBody} />);

export default ComposedContainerComponent;