##Infinite Scroll##
If you're looking to display multiple pages of data without the need to click 'Next' or manually select a page, use Griddle's infinite scrolling feature! One will need to set the 'enableInfiniteScroll' property to true in Griddle, as well as include the maximum height of the scrollable area (in pixels).

<dl>
  <dt>enableInfiniteScroll</dt>
  <dd><strong>bool</strong> - Whether or not paging is controlled by scroll position, rather than navigation. Default: false</dd>
</dl>
<dl>
  <dt>bodyHeight</dt>
  <dd><strong>int</strong> - The height, in pixels, that the scrollable area should be displayed in. Default: null</dd>
</dl>
<dl>
  <dt>useFixedHeader (Optional)</dt>
  <dd><strong>bool</strong> - Whether or not to have fixed column headers when scrolling, which is accomplished by having Griddle represented in two tables (with the headers in the first). As Griddle doesn't make many assumptions about much styling, this will ensure that the table headers will be displayed above the scrollable table body. Default: false</dd>
</dl>
<dl>
  <dt>infiniteScrollSpacerHeight (Optional)</dt>
  <dd><strong>int</strong> - The height, in pixels, of an extra row used to trigger paging. Changing this property should be a pretty rare occurrence. Default: 50</dd>
</dl>


#####Example:#####

```
<Griddle results={fakeData} columnMetadata={columnMeta} resultsPerPage={5} enableInfiniteScroll={true} bodyHeight={400}/>
```

@@include('./infiniteScroll/infiniteScroll.html')


###Fixed Header###
Generally, when using infinite scroll on a table, fixed headers are pretty desirable. To accomplish this, the 'useFixedHeader' property needs to be set to 'true'.

Griddle handles fixed headers in an Infinite Scroll situation by utilizing two separate tables, one containing the '<thead>' and the other containing the '<tbody>' as well as the capability to scroll. As we mention above, Griddle doesn't like to make many assumptions about much styling, so this is our surefire way to make sure that the headers stay put.

#####Example:#####
```
<Griddle results={fakeData} columnMetadata={columnMeta} resultsPerPage={5} enableInfiniteScroll={true} useFixedHeader={true} bodyHeight={400}/>
```
@@include('./infiniteScroll/infiniteScrollFixedHeader.html')

###External Results###
Feel free to scroll through your external data, too! When data is loading, the loading component will be appended to the end of the results.

#####Example:#####
```
<GriddleWithCallback showFilter={true} getExternalResults={fakeDataMethod}
 loadingComponent={Loading} enableInfiniteScroll={true} useFixedHeader={true} bodyHeight={400}/>
```
@@include('./infiniteScroll/infiniteScrollExternalResults.html')
