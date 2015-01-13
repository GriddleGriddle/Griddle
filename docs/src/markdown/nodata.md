##No Data##

Griddle will, by default, show a message if there is no data in the result set. There are two ways that it can be customized though.

####Basic NoData message####

The first way to customize what Griddle does when there is no data is setting the `noDataMessage` property.

<dl>
  <dt>noDataMessage</dt>
  <dd><strong>string</strong> - The message that will be displayed when there is no data</dd>
</dl>

#####Example:#####

```
<Griddle noDataMessage={"No data could be found."} />
```

@@include('./nodata/basic.html')

<hr />

####NoData Component####

Outside of the NoData message, Griddle can take a `customNoDataComponent` that will be displayed when there are no records.

<dl>
  <dt>customNoDataComponent</dt>
  <dd><strong>object</strong> - The component that will be displayed when there is no data</dd>
</dl>

#####Example:#####

```
var NoDataComponent = React.createClass({
    render: function(){
      return (<div>
          <h1>No data is available</h1>
          <a href="http://www.google.com">You can google for more data</a>
        </div>
      );
    }
});

React.render(<Griddle customNoDataComponent={NoDataComponent} />, document.getElementById("some-id"));
```

@@include('./nodata/component.html')
