##Subgrids##

Griddle also supports subgrids with little configuration. Simply add a property named "children" (or set the child column name property when defining the component) to any object in your list of data. Right now subgrids only work when the parent and child have the same columns, however, more advanced subgrid functionality is planned.

<dl>
  <dt>childrenColumnName (optional)</dt>
  <dd><strong>string</strong> - The name of the column that contains subgrid data.</dd>
</dl>

#####Example:#####

Assume our data has a child property similar to the following:

```
var data =  [
{
  "id": 0,
  "name": "Mayer Leonard",
  "city": "Kapowsin",
  "state": "Hawaii",
  "country": "United Kingdom",
  "company": "Ovolo",
  "favoriteNumber": 7,
  "children": [
  {
    "id": 273,
    "name": "Hull Wade",
    "city": "Monument",
    "state": "Nebraska",
    "country": "Cyprus",
    "company": "Indexia",
    "favoriteNumber": 10
    ...
  }]
},
...
]
```

Rendering a Griddle component with this data will show a subgrid without any configuration since the default child property name is **children**.

@@include('./subgrid/subgrid.html')
