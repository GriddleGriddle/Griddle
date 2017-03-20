import { configure } from '@kadira/storybook';

function loadStories() {
  require('../stories');
  require('../stories/date_problem');
}

configure(loadStories, module);
