Griddle
=======
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/DynamicTyped/Griddle?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


**GRIDDLE IS IN DEVELOPMENT**
You are welcome to use Griddle, however, it's in the early stages of development. There are likely bugs and other issues that need to be cleaned up :)

Please submit issues / pull requests for anything you run into.

----------

Griddle is a simple grid Component for use with React. It depends on [underscore.js](http://underscorejs.org/) and [React](http://facebook.github.io/react/).

Please check out the [documentation and examples](http://dynamictyped.github.io/Griddle).

To use Griddle:

`npm install griddle-react`

***Or***

download and reference griddle.js from the build directory (npm is preferred).

----------

To run from source, type the following commands into a terminal:

1. `npm install -g grunt-cli` if you don't have grunt.
2. `npm install`
3. `webpack` (Learn more about [webpack](http://webpack.github.io))
4. `grunt`
5. That's it!

###Changelog:###
0.1.19:

1. Updated some of the documentation to note forthcoming changes to ExternalResults etc.
2. Custom cell components now have a property  `rowData` as well as the `data`. [See here for more info](https://github.com/DynamicTyped/Griddle/issues/32)
3. Components reference just `React` now instead of `React/Addons`.

0.1.18:

1. Fixed a bug where initialSort property wasn't getting used
2. Added initialSortAscending prop (defaults to true)
3. Removed references to bootstrap
4. Fixed an issue with filtering and external results
5. External Results fixes/enhancements
6. Metadata enhancements

###Breaking Changes:###
From 0.1.19 - 0.2.0:
1. Updated the following properties:
 - **useCustomFormat** changed to **useCustomRowComponent**
 - **useCustomPager** changed to **useCustomPagerComponent**
 - **customFormat** changed to **customRowComponent**
 - **customPager** changed to **customPagerComponent**
 - **customFormatClassName** changed to **customRowComponentClassName**
 - **allowToggleCustom** to **enableToggleCustom**
 - **customNoData** changed to **customNoDataComponent**
 - *Significantly* changed **getExternalResults**. See the note below.

2. The **getExternalResults** property and loading data from an external source has been updated quite a bit.
 - Rather than exposing a single method to load data, a series of 'external_____' properties that allow the user to control what's Griddle's state have been created.
 - To support implementations before v0.2.0 using **getExternalResults** method, GriddleWithCallback was created. For more on GriddleWithCallback, [view the documentation here.]("http://dynamictyped.github.io/Griddle/externalData.html#griddle-with-callback")
 - [Check out the entire external data documentation to read more.]("http://dynamictyped.github.io/Griddle/externalData.html")
