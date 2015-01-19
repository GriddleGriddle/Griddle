##Styling##

Third-party components should work with your styles rather than force you into specific styling structure or framework. Griddle comes with default inline styling, however, it has been designed with the expectation that the inline styling will be augmented or replaced in most circumstances.


###Overriding Griddle's Styles###

Don't like Griddle's default styles? No problem -- turn them off entirely by setting the `useGriddleStyles` property to false. Griddle will render as a plain table (unless infinite scrolling is turned on) that you can apply your styles to. The following is Griddle rendered using [Skeleton framework](http://getskeleton.com/)'s default table styling.

@@include('./styling/plain.html')

We've [included a stylesheet](styles/griddle.css) that contains the default, inline styling that can be used as a starting point for creating custom Griddle styles.

<hr />

###Icons###

Out of the box, Griddle uses standard ascii characters for denoting sort direction, expanding / collapsing, etc. In many cases this is not ideal and better options exist. There are two ways to change the icons used in Griddle -- styling the CSS classes or supplying a configurable, custom component with the desired styling.

CSS classes:

<dl>
  <dt>sortAscendingClassName</dt>
  <dd><strong>string</strong> - The class that is applied to a column heading when the column is sorted in ascending order. Default: sort-ascending</dd>
</dl>

<dl>
  <dt>sortDescendingClassName</dt>
  <dd><strong>string</strong> - The class that is applied to a column heading when the column is sorted in descending order. Default: sort-descending</dd>
</dl>

<dl>
  <dt>parentRowCollapsedClassName</dt>
  <dd><strong>string</strong> - The class that is applied to the first column of a subgrid row when the row has child data that is not expanded. Default: parent-row</dd>
</dl>

<dl>
  <dt>parentRowExpandedClassName</dt>
  <dd><strong>string</strong> - The class that is applied to the first column of a subgrid row when the row has child data and the data is expanded. Default: parent-row expanded</dd>
</dl>

<dl>
  <dt>settingsToggleClassName</dt>
  <dd><strong>string</strong> - The class applied to the settings toggle. Default: settings</dd>
</dl>

<dl>
  <dt>nextClassName</dt>
  <dd><strong>string</strong> - The class applied to the next button in the pagination section. Default: griddle-next</dd>
</dl>

<dl>
  <dt>previousClassName</dt>
  <dd><strong>string</strong> - The class applied to the previous button in the pagination section. Default: griddle-previous</dd>
</dl>

Components:

<dl>
<dt>sortAscendingComponent</dt>
<dd><strong>object</strong> - The component or characters that are displayed in a column heading when the column data is sorted in ascending order. Default: ▲</dd>
</dl>

<dl>
<dt>sortDescendingComponent</dt>
<dd><strong>object</strong> - The component or characters that are displayed in a column heading when the column data is sorted in descending order. Default: ▼</dd>
</dl>

<dl>
<dt>parentRowCollapsedComponent</dt>
<dd><strong>object</strong> - The component or characters that are displayed in the first column of a subgrid row when the row has child data that is not expanded. Default: ▶</dd>
</dl>

<dl>
<dt>parentRowExpandedComponent</dt>
<dd><strong>object</strong> - The component or characters that are displayed in the first column of a subgrid row when the row has child data that is expanded. Default: ▼</dd>
</dl>

<dl>
<dt>settingsIconComponent</dt>
<dd><strong>object</strong> - The component or characters that are displayed next to the settings label. Default: null
</dl>

<dl>
<dt>nextIconComponent</dt>
<dd><strong>object</strong> - The component or characters that are displayed next to the next page text. Default: null</dd>
</dl>

<dl>
<dt>previousIconComponent</dt>
<dd><strong>object</strong> - The component or characters that are displayed next to the previous page text. Default: null</dd>
</dl>

#####Example:#####

We are going to change the sort characters to icons from the [Font-Awesome](http://fortawesome.github.io/Font-Awesome/) library.

First off we need to download and include the stylesheet (or include it from a CDN). For this example we're going to be using a CDN version.

```
<link href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">
```

Once FontAwesome is loaded, we need to load Griddle with the sortAscendingComponent and sortDescendingComponent properties set to elements using FontAwesome's classes.

```
React.render(<Griddle results={fakeData}
  sortAscendingComponent={<span className="fa fa-sort-alpha-asc"></span>}
  sortDescendingComponent={<span className="fa fa-sort-alpha-desc"></span>}/>,
  document.getElementById("some-id"));
```

When clicking on the ColumnHeaders, the font-awesome icons are used instead of the default characters.

@@include('./styling/icons.html')
