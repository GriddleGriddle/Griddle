##Customization##

__Please Note: Styling is similar to customization but is in its [own section](#) for clarity.__

Griddle comes with a number of customization options to help it fit with your project goals.

<hr />

###Custom Columns###

Custom column components are defined in the [Column Metadata object](#). The components are passed **data** and **rowData** properties.

<dl>
  <dt>data</dt>
  <dd><strong>object</strong> - the data that would normally be rendered in the column.</dd>
</dl>

<dl>
  <dt>rowData</dt>
  <dd><strong>object</strong> - the data for all items in the same row</dd>
</dl>

#####Example:#####

We are going to make the body of one of the columns a link. This link will use data from another column to determine the href.

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

<hr />


###Custom Rows###

Sometimes you may want to display grid data in a format other than a grid but still have pagination, filtering, etc. This type of formatting can be accomplished with the custom row format properties. To use custom row formatting, the **useCustomRowFormat** and the **customRowFormat** properties will need to be set.

<dl>
  <dt>useCustomRowFormat</dt>
  <dd><strong>bool</strong> - determines if custom row formats are applied</dd>
</dl>

<dl>
  <dt>customRowFormat</dt>
  <dd><strong>Component</strong> - the component to render in place of a grid row. This component receives a property named <strong>data</strong></dd>
</dl>

#####Example:#####

We are going to render our grid as a series of cards, keeping the pagination and filtering from Griddle in tact. Assume we are using the same data in the custom column example. We will need to create a custom component as follows:

```
var OtherComponent = React.createClass({
  getDefaultProps: function(){
    return { "data": {} };
  },
  render: function(){
    return (<div className="custom-row-card">
    <div className="name"><strong>{this.props.data.name}</strong><small>{this.props.data.company}</small></div>
    <div>{this.props.data.city}</div>
    <div>{this.props.data.state}, {this.props.data.country}</div>
    </div>);
  }
});

```

From there, Griddle can be rendered with the useCustomRowFormat and customRowFormat properties:

@@include('./customization/customRow.html')
