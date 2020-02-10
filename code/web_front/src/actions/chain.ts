import { ApiPromise, WsProvider } from '@polkadot/api';
import { RootActions } from './'
import { Dispatch } from 'redux';
import { RootStore } from '../containers/Root';
import { ChainSetting } from '../Chains';

export const SELECT_CHAIN = 'SELECT_CHAIN' as const;
export const selectChainById = (chainId: string) => ({
  type: SELECT_CHAIN,
  payload:chainId,
})

export const SET_CUSTOM = "SET_CUSTOM" as const;
export const setCustom = (custom: ChainSetting) => ({
  type:SET_CUSTOM,
  payload:custom,
})

export const SET_CUSTOM_ENDPOINT = "SET_CUSTOM_ENDPOINT" as const;
export const setCustomEndpoint = (ws_provider: string) => ({
  type:SET_CUSTOM_ENDPOINT,
  payload: ws_provider
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
  const chain = state.chain
  const selectedChain = chain.selectedChain;
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

export type Actions = ReturnType<typeof selectChainById | typeof setCustom | typeof setCustomEndpoint | typeof chainApiReady | typeof createApi | typeof disconnectChain >