import React from 'react';
import { render } from 'react-dom';
import store from './redux/store';
import { Provider } from 'react-redux';
import './style.css';
import { ErrorBoundary } from './error';
import ConnectedChartContainer from './chart-container';
import { INIT_DATA } from './redux/actions';

//React style
import R_Chart_1 from './react-style-charts/1';

//d3 style
import D_Chart_1 from './d3-style-charts/1';
import D_Chart_XAxis from './d3-style-charts/x-axis';
import D_Chart_YAxis from './d3-style-charts/y-axis';
import D_Chart_XYAxis from './d3-style-charts/xy-axis';
import D_Chart_Margins from './d3-style-charts/margins';
import D_Chart_Task1 from './d3-style-charts/task-1';
import D_Chart_Weather from './d3-style-charts/weather-data';
import D_Chart_Time from './d3-style-charts/time';
import D_Chart_Paragraph from './d3-style-charts/paragraph';
import D_Chart_IceElectric from './d3-style-charts/ice-vs-electric';
import D_Chart_Noom from './d3-style-charts/noom-replicate';
import D_Chart_Health from './d3-style-charts/health';
import D_Chart_Line_Area from './d3-style-charts/line-area';
import D_Chart_Bar_Test from './d3-style-charts/bar-test';
import D_Chart_Stacked_Bar from './d3-style-charts/stacked-bar';
import D_Chart_Stacked_Bar_Percentage from './d3-style-charts/stacked-bar-percentage';
import D_Chart_Zoom from './d3-style-charts/zoom';
import D_Chart_Brush from './d3-style-charts/brush';
import D_Chart_Radar from './d3-style-charts/radar';
import D_Chart_HeatMap from './d3-style-charts/heat-map';

const App = () => {
    const initData = () => store.dispatch({ type: INIT_DATA });
    initData();

    return (
      <ErrorBoundary>
        <Provider store={store}>
          <ConnectedChartContainer>
             {
               //Receive a callback from the chart container to render the children and call children as a function, passing in the chart data as an object. The return value (a new component) can then be rendered and the data passed like a callback function
              ({ chartData, updateData }: any) => (
                <React.Fragment>
                  <h2>D3 style charts</h2>
                  { /*<D_Chart_1></D_Chart_1> */ }
                  

                  <hr/>

                  <h2>React style charts</h2>
                  { /* <R_Chart_1 chartData={chartData}></R_Chart_1> */}
                </React.Fragment>
              )
            }
          </ConnectedChartContainer>

          <h2>D3 style charts</h2>
          { /*<D_Chart_1></D_Chart_1> */}
          {/* <D_Chart_XAxis></D_Chart_XAxis>
          <D_Chart_YAxis></D_Chart_YAxis>
          <D_Chart_XYAxis></D_Chart_XYAxis>*/}
          {/* <D_Chart_Margins></D_Chart_Margins> */}
          {/* <D_Chart_Task1></D_Chart_Task1> */}
          {/* <D_Chart_Weather></D_Chart_Weather> */}
          {/* <D_Chart_Time></D_Chart_Time> */}
          {/* <D_Chart_Paragraph></D_Chart_Paragraph> */}
          {/* <D_Chart_IceElectric></D_Chart_IceElectric> */}
          {/* <D_Chart_Noom></D_Chart_Noom> */}
          {/* <D_Chart_Health></D_Chart_Health> */}
          {/* <D_Chart_Line_Area></D_Chart_Line_Area> */}
          {/* <D_Chart_Bar_Test></D_Chart_Bar_Test> */}
          <D_Chart_Stacked_Bar></D_Chart_Stacked_Bar>
          <D_Chart_Stacked_Bar_Percentage></D_Chart_Stacked_Bar_Percentage>
          
          <D_Chart_Zoom></D_Chart_Zoom>
          {/* <D_Chart_Brush></D_Chart_Brush> */}
          {/* <D_Chart_Radar></D_Chart_Radar> */}
          {/* <D_Chart_HeatMap></D_Chart_HeatMap> */}

          <hr />

          <h2>React style charts</h2>
          { /* <R_Chart_1 chartData={chartData}></R_Chart_1> */}

        </Provider>
      </ErrorBoundary>
    );
}

render(<App />, document.getElementById('root'));

export default App;