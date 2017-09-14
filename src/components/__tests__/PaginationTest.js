import React from 'react';
import test from 'ava';
import { shallow } from 'enzyme';

import Pagination from '../Pagination';

test('renders', (t) => {
  const wrapper = shallow(<Pagination />);

  t.true(wrapper.matchesElement(<div />));
});

test('renders with style', (t) => {
  const style = { backgroundColor: "#EDEDED" };
  const wrapper = shallow(<Pagination style={style} />);

  t.true(wrapper.matchesElement(<div style={{ backgroundColor: '#EDEDED'}} />));
});

test('renders with className', (t) => {
  const wrapper = shallow(<Pagination className="className" />);

  t.true(wrapper.matchesElement(<div className="className" />));
});

test('renders children', (t) => {
  const next = () => <button>Next</button>;
  const previous = () => <button>Previous</button>;
  const pageDropdown = () => <div>Dropdown</div>;

  const wrapper = shallow(<Pagination
    Next={next}
    Previous={previous}
    PageDropdown={pageDropdown}
  />);

  const previousRendered = wrapper.childAt(0);
  t.is(previousRendered.html(), '<button>Previous</button>');

  const pageDropdownRendered = wrapper.childAt(1);
  t.is(pageDropdownRendered.html(), '<div>Dropdown</div>');

  const nextRendered = wrapper.childAt(2);
  t.is(nextRendered.html(), '<button>Next</button>');
});

