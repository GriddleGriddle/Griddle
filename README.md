Griddle
=======

An ultra customizable datagrid component for React
----------

[![Gitter](https://badges.gitter.im/JoinChat.svg)](https://gitter.im/DynamicTyped/Griddle?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![Build Status](https://travis-ci.org/GriddleGriddle/Griddle.svg?branch=master)](https://travis-ci.org/GriddleGriddle/Griddle)

----------

Please check out the [documentation and examples](http://griddlegriddle.github.io/Griddle/).

TLDR: Griddle now has a customizable architecture that allows for one-off customizations or reusable plugins. These customization options allow for overriding everything from components, to internal datagrid state management, and more.

----------

To use Griddle:

`npm install griddle-react`

----------

To run from source:

1. `npm install`
2. `npm run storybook`

----------

### Issues: ###

If you run into an issue in Griddle please let us know through the issue tracker. It is incredibly helpful if you create a failing test(s) and/or a storybook story that demonstrates the issue as a pull request and reference this pull request in the issue. To add a storybook story, navigate to `/stories/index.js` and add a story to the `storiesOf('Bug fixes' ...)` section. 

### Contributing: ###

Please feel free submit any bugs. Any questions should go in the [Gitter chat](https://gitter.im/DynamicTyped/Griddle) channel or [stackoverflow](http://stackoverflow.com/). Pull requests are welcome but if you have an idea please post as an issue first to make sure everyone is on the same-page (and to help avoid duplicate work). If you are looking to help out but don't know where to start, please take a look at [approved issues that don't have anyone assigned](https://github.com/GriddleGriddle/Griddle/issues?q=is%3Aopen+label%3Aapproved+no%3Aassignee).

We do most of our initial feature development in the [Storybook](https://github.com/storybooks/react-storybook) stories contained in this project. When you run `npm run storybook`, a web server is setup that quickly provides access to Griddle in various states. All storybook stories are currently in `/stories/index.js`

We would love any help at all but want to call out the following things:
* Help maintaining 0.x
* More tests - we have a number of tests in version 1.0 but not quite where we'd like it to be
* More plugins
