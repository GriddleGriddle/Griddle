import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import Cell from '../src/components/Cell';


storiesOf('Cell', module)
  .add('to Storybook', () => {
    const someValue = "hi from storybook"

    return <table>
      <tr>
        <Cell value={someValue}
          className="someClass"
          style={{ fontSize: 20, color: "#FAB" }}
          onClick={() => console.log('clicked')}
          onMouseOver={() => console.log('hovered')}
        />
      </tr>
    </table>
  });
