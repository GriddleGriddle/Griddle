import 'jsdom-global/register';
import React from 'react';
import test from 'ava';
import { shallow, mount } from 'enzyme';

import Settings from '../Settings';

test('renders with style', (t) => {
  const style = { backgroundColor: '#EDEDED' };
  const wrapper = shallow(<Settings style={style} />);

  t.true(wrapper.matchesElement(<div style={{ backgroundColor: '#EDEDED' }} />));
});

test('renders with className', (t) => {
  const wrapper = shallow(<Settings className="className" />);

  t.true(wrapper.matchesElement(<div className="className" />));
});

test('renders each settings component', (t) => {
  const component1 = () => <div className="one">One</div>;
  const component2 = () => <div className="two">Two</div>;

  const settingsComponents = [component1, component2];

  const wrapper = mount(<Settings settingsComponents={settingsComponents} />);
  const one = wrapper.find('.one');
  const two = wrapper.find('.two');

  t.true(one.matchesElement(<div className="one">One</div>));
  t.true(two.matchesElement(<div className="two">Two</div>));
});

test('ignores missing components', (t) => {
  const settingsComponents = [null, undefined];
  const wrapper = shallow(<Settings settingsComponents={settingsComponents} />);

  t.true(wrapper.matchesElement(<div />));
});
