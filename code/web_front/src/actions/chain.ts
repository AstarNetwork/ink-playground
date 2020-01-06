import { ApiPromise, WsProvider } from '@polkadot/api';
import { Dispatch } from 'redux';

export const SELECT_CHAIN = 'SELECT_CHAIN' as const;
export const selectChainById = (chainId: string) => ({
  type: SELECT_CHAIN,
  payload:chainId,
})

export const SET_CUSTOM = "SET_CUSTOM" as const;
export const setCustom = (ws_provider: WsProvider, type: object = {}) => ({
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

export type Actions = ReturnType<typeof selectChainById | typeof setCustom | typeof chainApiReady | typeof createApi | typeof disconnectChain>

export const startSelectedChain = () => {
  return (dispatch: Dispatch<Actions>, getState: any) => {
    stopChain(dispatch, getState);
    const state = getState();
    const { selectedChainId } = state.chain
    const selectedChain = state.chain.items[selectedChainId]
    const provider = new WsProvider(selectedChain.ws_provider);
    dispatch(chainApiReady(false))
    const chainApi = new ApiPromise({provider, types:selectedChain.types })
    chainApi.on('ready',()=>{dispatch(chainApiReady(true))})
    chainApi.on('disconnected',()=>{dispatch(chainApiReady(false))})
    dispatch(createApi(chainApi))
    return Promise.resolve();
  }
}

export const DISCONNECT_CHAIN = 'DISCONNECT_CHAIN' as const;
const disconnectChain = () => ({
  type: DISCONNECT_CHAIN,
  payload: true,
})

const stopChain = (dispatch: Dispatch<Actions> ,getState: any):void => {
  const state = getState();
  const { chainApiDisconnected, chainApi } = state.chain;
  if( chainApi && !chainApiDisconnected ){
    chainApi.disconnect();
    dispatch(disconnectChain());
  }
}

