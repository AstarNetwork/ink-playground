import React from 'react'
import { Provider } from 'react-redux'
import configureStore from '../configureStore'
import App from './App'
import { startSelectedChain, selectChainById ,getAccounts } from '../actions'

const store = configureStore()

store.dispatch(getAccounts());
store.dispatch(selectChainById('local'));
store.dispatch(startSelectedChain());

export default () => {
  return(
    <Provider store={store} >
      <App/>
    </Provider>
  )
}
