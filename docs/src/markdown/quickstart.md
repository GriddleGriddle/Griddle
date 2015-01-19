##Quickstart##

####From NPM####

Griddle is in the npm repository as <a href="https://www.npmjs.org/package/griddle-react">griddle-react</a>. Simply install React and Griddle from npm:
```
npm install react --save
npm install griddle-react --save
```
From there, require React and Griddle in your modules and you should be all set!
```
var React = require('react');
var Griddle = require('griddle-react');
```
Please take a look at a basic [gulp example](https://github.com/ryanlanciaux/griddle-gulp-test) or a [webpack example](https://github.com/ryanlanciaux/griddle-webpack-test) for more information.

####From Source####

At the most basic level, using Griddle is as simple as wiring up an array of JSON objects as a property to the component. First off, include Underscore and React. Include Griddle and the stylesheet before your React Code.

```
<link href="css/griddle.css" rel="stylesheet" />
...
<script src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js"></script>
<script src="//fb.me/react-0.12.0.js"></script>
<script src="//fb.me/JSXTransformer-0.12.0.js"></script>
<script type="text/javascript" src="scripts/griddle.js"></script>
```
<hr/>
Define an array of JSON objects -- for our examples we have something that resembles the following:
```
var fakeData =  [
  {
    "id": 0,
    "name": "Mayer Leonard",
    "city": "Kapowsin",
    "state": "Hawaii",
    "country": "United Kingdom",
    "company": "Ovolo",
    "favoriteNumber": 7
  },
  ...
];
```

From there, render a Griddle component through React.renderComponent or in the Render method of another component. 

```
<Griddle results={fakeData} />
```


@@include('./quickstart/basic.html')

<a name="advanced"></a>
##More Advanced Example##
For many applications, simple paging and sorting is not enough. Griddle comes equipped with filtering, initial columns and additional grid settings out of the box. To use these features, simply define the showProperties and showFilters properties on the Griddle component definition. Check out the full list of properties available to Griddle in the [prop documentation](properties.html).

Using the same data as in the previous example, we can add filtering, grid settings and default columns by defining our component as follows:

```
<Griddle results={fakeData} tableClassName="table" showFilter={true}
 showSettings={true} columns={["name", "city", "state", "country"]}/>
```

@@include('./quickstart/advanced.html')
