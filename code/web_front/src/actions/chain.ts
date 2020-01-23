import { ApiPromise, WsProvider } from '@polkadot/api';
import { RootActions } from './'
import { Dispatch } from 'redux';
import { RootStore } from '../containers/Root';

export const SELECT_CHAIN = 'SELECT_CHAIN' as const;
export const selectChainById = (chainId: string) => ({
  type: SELECT_CHAIN,
  payload:chainId,
})

export const SET_CUSTOM = "SET_CUSTOM" as const;
export const setCustom = (ws_provider: string, type: object = {}) => ({
  type:SET_CUSTOM,
  payload: {
    ws_provider,
    type,
  },
})

export const CHAIN_API_READY = 'CHAIN_API_READY' as const;;
const chainApiReady = (isReady: boolean) => ({
  type: CHAIN_API_READY,
  payload: isReady,
})

export const CREATE_API = 'CREATE_API' as const;
const createApi = (chainApi: ApiPromise) => ({
  type: CREATE_API,
  payload: chainApi,
})

export const startSelectedChain = () => ((dispatch: Dispatch<RootActions>, getState: (()=>RootStore)) => {
  const state: RootStore = getState();
  stopChain(dispatch, state);
  const { selectedChainId } = state.chain
  const selectedChain = state.chain.items[selectedChainId]
  const provider = new WsProvider(selectedChain.ws_provider);
  dispatch(chainApiReady(false))
  const chainApi = new ApiPromise({provider, types:selectedChain.types })
  chainApi.on('ready',()=>{dispatch(chainApiReady(true))})
  chainApi.on('disconnected',()=>{dispatch(chainApiReady(false))})
  dispatch(createApi(chainApi))
  return Promise.resolve();
})

export const DISCONNECT_CHAIN = 'DISCONNECT_CHAIN' as const;
const disconnectChain = () => ({
  type: DISCONNECT_CHAIN,
  payload: true,
})

const stopChain = (dispatch: Dispatch<RootActions> ,state: RootStore):void => {
  const { chainApiDisconnected, chainApi } = state.chain;
  if( chainApi && !chainApiDisconnected ){
    chainApi.disconnect();
    dispatch(disconnectChain());
  }
}

export type Actions = ReturnType<typeof selectChainById | typeof setCustom | typeof chainApiReady | typeof createApi | typeof disconnectChain >