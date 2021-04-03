//Redux
import { Action, applyMiddleware, createStore } from 'redux'
// import logger from './middleware/logger.thunk';
import thunkMiddleware from 'redux-thunk'
// import { composeWithDevTools } from 'redux-devtools-extension'
import { configureStore } from '@reduxjs/toolkit'
import logger from './logger';
import { INIT_DATA, UPDATE_DATA } from './actions';


const DEFAULT_STATE = {
  vehicles: []
};

const rootReducer = (state = DEFAULT_STATE, action: Action): any => {
  switch(action.type) {
    case INIT_DATA:
      return {
        ...state,
        vehicles: [[10, 100], [20, 20]]
      }
    case UPDATE_DATA:
      return {
        ...state,
        vehicles: [[30, 120], [50, 40]]
      }
    default:
      return state;
  }
};


export default configureStore({
  reducer: rootReducer,
  // middleware: [logger]
})