# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project _now_ adheres to [Semantic Versioning](http://semver.org/).

## [1.5.0] - 2017-05-08
- Update to PropTypes library instead of using deprecated React version
- Respect sortable columns
- Add lodash babel plugin (for smaller builds)
- Column ordering
- Conditional columns
- Thanks @followbl, @dahlbyk, @bpugh, @andreme!

## [1.4.0] - 2017-04-21
- CSS class name can be a function (to generate the name)

## [1.3.1] - 2017-04-18
- Fix for cssClassName and headerCssClassName
- Thanks @zeusi83!

## [1.3.0] - 2017-04-04
- Add type definitions to Griddle
- Settings Component customization [See this PR for more info](https://github.com/GriddleGriddle/Griddle/pull/628)
- Table / No result improvements [See this PR for more info](https://github.com/GriddleGriddle/Griddle/pull/624)
- Thanks a ton @dahlbyk for these!

## [1.2.0] - 2017-03-21
- Fix for dates in data

## [1.1.0] - 2017-03-04
- Add rowKey option to RowDefinition

## [1.0.3] - 2017-03-03
### Fixed
- Fix a problem where columns could not have the same title

## [1.0.2] - 2017-03-03
### Fixed
- Fix a problem toggling columns that don't have related data

## [1.0.1] - 2017-02-28
### Added
- Fixed performance problem with cell selectors -- anecdotal but ~500k rows on my computer is pretty fast as opposed to previous lag

## [1.0.0] - 2017-02-19
### Added
- New version of Griddle. [See the docs](http://griddlegriddle.github.io/Griddle/) for more information.
