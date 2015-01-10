##Styling##

Third-party components should work with your styles rather than force you into specific styling structure or framework. Griddle comes with default inline styling, however, it has been designed with the expectation that the inline styling will be augmented or replaced in most circumstances.

###Icons###

Out of the box, Griddle uses standard ascii characters for denoting sort direction, expanding / collapsing, etc. In many cases this is not ideal and better options exist. There are two ways to change the icons used in Griddle, by styling the `sort-ascending, sort-descending, parent-row, parent-row.expanded` classes or modifying the `sortAscendingClassName, sortDescendingClassName, parentRowCollapsedClassName, parentRowExpandedClassName` to be existing CSS classes that have the desired styling.

#####Example:#####

We are going to change the sort icons to icons from the [Font-Awesome](http://fortawesome.github.io/Font-Awesome/) library.

First off we need to download and include the stylesheet (or include it from a CDN). For this example we're going to be using a CDN version.

```
<link href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">
```

Once FontAwesome is loaded, we need to load Griddle with the sortAscendingComponent and sortDescendingComponent properties set to elements using FontAwesome's classes.

```
React.render(<Griddle results={fakeData} sortAscendingComponent={<span className="fa fa-sort-alpha-asc"></span>} sortDescendingComponent={<span className="fa fa-sort-alpha-desc"></span>}/>, document.getElementById("some-id"));
```

@@include('./styling/icons.html')

<hr />
