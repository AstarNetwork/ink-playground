import { combineReducers } from 'redux'
import { SELECT_ACCOUNT, RECEIVE_ACCOUNTS, REQUEST_ACCOUNTS } from '../actions'
import { Actions } from '../actions/account'
import { KeyringPair } from '@polkadot/keyring/types'

const selectedAccount = (state: (KeyringPair | null) = null, action : Actions) => {
  switch(action.type){
    case SELECT_ACCOUNT:
      return action.payload
    default:
      return state
  }
}

const items = (state: KeyringPair[] =[], action: Actions) => {
  switch(action.type){
    case RECEIVE_ACCOUNTS:
      return action.payload
    default:
      return state
  }
}

const accountsLoaded = (state: boolean = false, action: Actions) => {
  switch(action.type){
    case REQUEST_ACCOUNTS:
      return false
    case RECEIVE_ACCOUNTS:
      return true
    default:
      return state
  }
}
const account = combineReducers({
  selectedAccount,
  accountsLoaded,
  items,
})

export default account
