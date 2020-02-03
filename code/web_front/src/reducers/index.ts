import { combineReducers } from 'redux'
import chain from './chain'
import account from './account'
import consoleArea from './consoleArea'

const reducers = combineReducers({
  chain,
  account,
  consoleArea,
})

export default reducers;
