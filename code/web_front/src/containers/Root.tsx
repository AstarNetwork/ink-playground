import React from 'react'
import { Provider } from 'react-redux'
import configureStore from '../configureStore'
import App from './App'
import Modal from 'react-modal'
import { startSelectedChain, selectChainById ,getAccounts } from '../actions'

const store = configureStore()

export type RootStore = ReturnType<typeof store.getState>;

store.dispatch<any>(getAccounts());
store.dispatch(selectChainById('local'));
store.dispatch<any>(startSelectedChain());

Modal.setAppElement('#root');

export default () => {
  return(
    <Provider store={store} >
      <App/>
    </Provider>
  )
}
