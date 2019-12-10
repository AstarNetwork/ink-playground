import { combineReducers } from 'redux'
import chain from './chain'
import account from './account'
import consoleArea from './consoleArea'


export default combineReducers({
  chain,
  account,
  consoleArea,
})
