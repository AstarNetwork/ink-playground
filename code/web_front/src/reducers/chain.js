import { combineReducers } from 'redux'
import Chains from '../Chains'
import { SELECT_CHAIN, CREATE_API, CHAIN_API_READY, DISCONNECT_CHAIN } from '../actions'

const chainItems = Chains

const selectedChainId = (state='flaming_fir', action) => {
  switch(action.type){
    case SELECT_CHAIN:
      return action.payload;
    default:
      return state
  }
}

const chainApi = (state=null, action) => {
  switch(action.type){
    case CREATE_API:
      return action.payload
    default:
      return state
  }
}

//disconnect shoud be done only once
const chainApiDisconnected = (state=true, action) => {
  switch(action.type){
    case CREATE_API:
      return false
    case DISCONNECT_CHAIN:
      return true
    default:
      return state
  }
}

const chainApiIsReady = (state=false, action) => {
  switch(action.type){
    case CHAIN_API_READY:
      return action.payload
    default:
      return state
  }
}

const items = () => chainItems

const chain = combineReducers({
  selectedChainId,
  chainApi,
  chainApiDisconnected,
  chainApiIsReady,
  items,
});

export default chain
