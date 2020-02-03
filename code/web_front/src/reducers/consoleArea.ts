import { combineReducers } from 'redux'
import { CLEAR_CONSOLE, ADD_CONSOLE } from '../actions'
import { Actions } from '../actions/consoleArea'

const value = (state: string = "",action: Actions) => {
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
