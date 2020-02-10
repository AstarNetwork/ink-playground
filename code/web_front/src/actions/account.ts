import { web3Accounts } from '@polkadot/extension-dapp';
import keyring from '@polkadot/ui-keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk'
import { RootStore } from '../containers/Root'
import { RootActions } from './'
import { KeyringJson$Meta } from '@polkadot/ui-keyring/types';

export const SELECT_ACCOUNT = 'SELECT_ACCOUNT' as const;
export const selectAccount = (account : KeyringPair) => ({
  type: SELECT_ACCOUNT,
  payload: account,
})

export const REQUEST_ACCOUNTS = 'REQUEST_ACCOUNTS' as const;
const requestAccounts = () => ({
  type: REQUEST_ACCOUNTS,
})

export const RECEIVE_ACCOUNTS = 'RECEIVE_ACCOUNTS' as const;
const receiveAccounts = (accounts : KeyringPair[]) => ({
  type: RECEIVE_ACCOUNTS,
  payload: accounts,
})

const loadAccounts = (injectedAccounts? : {address: string; meta: KeyringJson$Meta}[]) => {
  keyring.loadAll({
    isDevelopment: true
  }, injectedAccounts);
  return keyring.getPairs();
};

export const getAccounts = (): ThunkAction<void,RootStore,undefined,RootActions> => {
  return (dispatch: Dispatch<Actions>, getState: any) => {
    web3Accounts()
      .then((accounts) => {
        return accounts.map(({ address, meta }) => ({
          address,
          meta: {...meta,name: `${meta.name} (${meta.source})`}
        }));
      })
      .then((injectedAccounts) => {
        dispatch(receiveAccounts(loadAccounts(injectedAccounts)));
      })
      .catch(()=>{
        dispatch(receiveAccounts(loadAccounts([])));
      });
  }
}

export type Actions = ReturnType<typeof selectAccount | typeof requestAccounts | typeof receiveAccounts　>
