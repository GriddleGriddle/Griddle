##Customization##

__Please Note: Styling is similar to customization but is in its [own section](#) for clarity.__

Griddle comes with a number of customization options to help it fit with your project goals.

###Custom Columns###

Custom column components are defined in the [Column Metadata object](#). The components are passed **data** and **rowData** properties. The **data** consists of the information that would normally be rendered in the column. The **rowData** property contains the data for all items in the same row.

####Example:####

We are going to make the body of one of the columns a link. This link will use data from another column to determin the href.

Assume we have the following data for our grid:

```
var someData =  [
{
  "id": 0,
  "name": "Mayer Leonard",
  "city": "Kapowsin",
  "state": "Hawaii",
  "country": "United Kingdom",
  "company": "Ovolo",
  "favoriteNumber": 7
  },
  {
    "id": 1,
    "name": "Koch Becker",
    "city": "Johnsonburg",
    "state": "New Jersey",
    "country": "Madagascar",
    "company": "Eventage",
    "favoriteNumber": 2
  },
  ...
];
```

We want the **name** column to be a link to `/speakers/state/name` (where state and name are pulled in from the data). We can define a customComponent to be rendered as follows:

```
var LinkComponent = React.createClass({
  render: function(){
    url ="speakers/" + this.props.rowData.state + "/" + this.props.data;
    return <a href={url}>{this.props.data}</a>
  }
});
```

From there, we will set the customComponent value in the **name** columnMetadata object to this LinkComponent.

```
var columnMeta = [
  {
  ...
  "columnName": "name",
  "order": 1,
  "locked": false,
  "visible": true,
  "customComponent": LinkComponent
  },
  ...
];
```

Now, when Griddle is rendered with this columnMetadata, it should write the link as expected.

```
React.render(<Griddle data={someData} columnMetdata={columnMeta} />,
   document.getElementById('something'));
```

@@include('./customization/customColumn.html')
