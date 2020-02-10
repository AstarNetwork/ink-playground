import { combineReducers } from 'redux'
import Chains, { ChainSetting } from '../Chains'
import { SELECT_CHAIN, CREATE_API, CHAIN_API_READY, DISCONNECT_CHAIN, SET_CUSTOM, SET_CUSTOM_ENDPOINT } from '../actions/chain'
import { Actions } from '../actions/chain'
import { ApiPromise } from '@polkadot/api'

const selectedChain = (state: ChainSetting = Chains['local'], action: Actions) => {
  switch(action.type){
    case SELECT_CHAIN:
      return Chains[action.payload];
    case SET_CUSTOM:
      return action.payload;
    case SET_CUSTOM_ENDPOINT:
      return {
        ...state,
        ws_provider:action.payload
      } as ChainSetting
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

const items = (state: any = {},action : Actions) => {
  return Chains
}

const chain = combineReducers({
  selectedChain,
  chainApi,
  chainApiDisconnected,
  chainApiIsReady,
  items,
});

export default chain
