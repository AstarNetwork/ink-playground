import { combineReducers } from 'redux'
import Chains from '../Chains'
import { SELECT_CHAIN, CREATE_API, CHAIN_API_READY, DISCONNECT_CHAIN, SET_CUSTOM } from '../actions'
import { Actions } from '../actions/chain'
import { ApiPromise } from '@polkadot/api'

const selectedChainId = (state: string = 'flaming_fir', action: Actions) => {
  switch(action.type){
    case SELECT_CHAIN:
      return action.payload;
    default:
      return state
  }
}

const chainApi = (state: (ApiPromise | null) =null, action: Actions) => {
  switch(action.type){
    case CREATE_API:
      return action.payload
    default:
      return state
  }
}

//disconnect shoud be done only once
const chainApiDisconnected = (state: boolean = true, action: Actions) => {
  switch(action.type){
    case CREATE_API:
      return false
    case DISCONNECT_CHAIN:
      return true
    default:
      return state
  }
}

const chainApiIsReady = (state: boolean = false, action : Actions) => {
  switch(action.type){
    case CHAIN_API_READY:
      return action.payload
    default:
      return state
  }
}

const customChain = (state ={id:"custom",name:"Custom Chain",ws_provider:"ws://localhost:9944",type:{}}, action : Actions) => {
  switch(action.type){
    case SET_CUSTOM:
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state;
  }
}

const items = (state: any ={},action : Actions) => {
  var custom = customChain(!!state.custom?state.custom:undefined, action);
  return({
      custom,
      ...Chains,
  })
}

const chain = combineReducers({
  selectedChainId,
  chainApi,
  chainApiDisconnected,
  chainApiIsReady,
  items,
});

export default chain
