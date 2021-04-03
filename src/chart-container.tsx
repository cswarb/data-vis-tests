import React from 'react';
import { INIT_DATA, StoreActions, UPDATE_DATA } from './redux/actions';
import { selectAppState, selectVehicles } from './redux/selectors';
import store from './redux/store';
import { connect } from 'react-redux'

const ChartContainer = (props: any) => {
  // console.log('props: ', props)

  return <div>
    {
      //Use render props to pass the child component the chart data
      props.children({
        chartData: props.chartData,
        updateData: () => store.dispatch({type: UPDATE_DATA})
      })
    }
  </div>
}

//Called when the store gets updated
const mapStateToProps = (state: any) => {
  return {
    chartData: selectVehicles(state)
  }
}

// const mapDispatchToProps = (dispatch) => {
//   return {
//     onTodoClick: (id) => {
//       dispatch({})
//     }
//   }
// }

//Connects a react components to redux store using connect()
const ConnectedChartContainer = connect(
  mapStateToProps,
  // mapDispatchToProps
)(ChartContainer)

export default ConnectedChartContainer;