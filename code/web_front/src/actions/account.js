import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import keyring from '@polkadot/ui-keyring';

export const SELECT_ACCOUNT = 'SELECT_ACCOUNT'
export const selectAccount = (account) => ({
  type: SELECT_ACCOUNT,
  payload: account,
})

export const REQUEST_ACCOUNTS = 'REQUEST_ACCOUNTS';
const requestAccounts = () => ({
  type: REQUEST_ACCOUNTS,
})

export const RECEIVE_ACCOUNTS = 'RECEIVE_ACCOUNTS';
const receiveAccounts = (accounts) => ({
  type: RECEIVE_ACCOUNTS,
  payload: accounts,
})

const loadAccounts = (injectedAccounts) => {
  keyring.loadAll({
    isDevelopment: true
  }, injectedAccounts);
  return keyring.getPairs();
};

export const getAccounts = () => {
  return (dispatch,getState) => {
    dispatch(requestAccounts());
    web3Enable('ink-playground')
    .then((extensions) => {
      web3Accounts()
      .then((accounts) => {
        return accounts.map(({ address, meta }) => ({
          address,
          meta: {...meta,name: `${meta.name} (${meta.source})`}
        }));
      })
      .then((injectedAccounts) => {
        dispatch(receiveAccounts(loadAccounts(injectedAccounts)));
      }).catch(console.error);
    }).catch(console.error);
  }
}
