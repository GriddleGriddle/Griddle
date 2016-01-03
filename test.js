import { DefaultModules } from 'griddle-render';

import React from 'react';
import Griddle from './index';
import ChartistGraph from 'react-chartist';

/* TODO:
 *   Figure out if you need to pass all the DefaultModules / Extended in
 *   Get plugins working
 *   Publish This and document
 *
 * */

function getLineChartData(data) {
  return {
    labels: ['Jan', 'Feb', 'March', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    series: data.map(d => [d.january, d.february, d.march, d.april, d.may, d.june, d.july, d.august, d.september, d.october, d.november, d.december])
  }
}

const WeatherChart = React.createClass({
  render() {
    const data = getLineChartData(this.props.data);
    return <ChartistGraph data={data} type={'Line'} />
  }
});


export default class extends React.Component {
  render() {
    const {data} = this.props;

    return <Griddle
      components={{ Table: WeatherChart }}
      {...this.props}
/>
  }
}

