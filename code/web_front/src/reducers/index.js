import { combineReducers } from 'redux'
import chain from './chain'
import account from './account'


export default combineReducers({
  chain,
  account,
})
