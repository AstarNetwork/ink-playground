import React from 'react'
import { Provider } from 'react-redux'
import configureStore from '../configureStore'
import App from './App'
import Modal from 'react-modal'
import { getAccounts } from '../actions'

const store = configureStore()

export type RootStore = ReturnType<typeof store.getState>;
store.dispatch<any>(getAccounts());

Modal.setAppElement('#root');

export default () => {
  return(
    <Provider store={store} >
      <App/>
    </Provider>
  )
}
