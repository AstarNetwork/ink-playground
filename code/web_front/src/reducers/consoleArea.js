import { combineReducers } from 'redux'
import { CLEAR_CONSOLE, ADD_CONSOLE } from '../actions'

const value = (state="",action) => {
  switch(action.type){
    case CLEAR_CONSOLE:
      return ""
    case ADD_CONSOLE:
      return state+action.payload;
    default:
      return state
  }
}

export default combineReducers({value})
