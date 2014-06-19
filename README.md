Griddle
=======


**GRIDDLE IS VERY MUCH IN DEVELOPMENT**
You are welcome to use Griddle, however, it's in the very early stages of development. There are likely bugs and other issues that need to be cleaned up -- use at your own risk. Please submit issues / pull requests for anything you run into. 

----------

Griddle is a simple grid Component for use with React. It depends on [underscore.js](http://underscorejs.org/) and [Bootstrap 3](http://getbootstrap.com/) (as well as [React](http://facebook.github.io/react/)). 

To Use Griddle, include griddle.js / griddle.css below the requirements listed above. From there, simply create a Griddle component in your jsx as so `<Griddle results= {data} />`. There are several additional properties that can be used to change the behavior of the component:

- **Columns** - The columns that should be displayed. Any items that have a different key than one contained in the *Columns* array will not be displayed in the table. It will still be available in the column chooser. The default is an empty array which will show all columns.
- **resultsPerPage** - The number of records to show on a given page. The default value is 10 
- **initialSort** - The column to sort on initially. By default this is not set.   
- **gridClassName** - The css class/classes to apply to the grid table element. The default is `table` which  applies some Bootstrap table styling. 

To try it out: 

1. `npm install -g http-server` (a grunt option should be available a little later to make this all a bit simpler).
2. get the Griddle repository and `cd` to the directory where it is located
3. Run `http-server`
4. Navigate to http://localhost:8080 in your browser. 

