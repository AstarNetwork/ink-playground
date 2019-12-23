import { ApiPromise, WsProvider } from '@polkadot/api';

export const SELECT_CHAIN = 'SELECT_CHAIN'
export const selectChainById = (chainId) => ({
  type: SELECT_CHAIN,
  payload:chainId,
})

export const SET_CUSTOM = "SET_CUSTOM"
export const setCustom = (ws_provider, type={}) => ({
  type:SET_CUSTOM,
  payload: {
    ws_provider,
    type,
  },
})

export const CHAIN_API_READY = 'CHAIN_API_READY';
const chainApiReady = (isReady) => ({
  type: CHAIN_API_READY,
  payload: isReady,
})

export const CREATE_API = 'CREATE_API'
const createApi = (chainApi) => ({
  type: CREATE_API,
  payload: chainApi,
})


export const startSelectedChain = () => {
  return (dispatch,getState) => {
    dispatch(stopChain())
    const state = getState();
    const { selectedChainId } = state.chain
    const selectedChain = state.chain.items[selectedChainId]
    const provider = new WsProvider(selectedChain.ws_provider);
    dispatch(chainApiReady(false))
    const chainApi = new ApiPromise({provider, types:selectedChain.types })
    chainApi.on('ready',()=>{dispatch(chainApiReady(true))})
    chainApi.on('disconnect',()=>{dispatch(chainApiReady(false))})
    dispatch(createApi(chainApi))
    return Promise.resolve();
  }
}

export const DISCONNECT_CHAIN = 'DISCONNECT_CHAIN';
const disconnectChain = () => ({
  type: DISCONNECT_CHAIN,
  payload: true,
})

const stopChain = () => {
  return (dispatch,getState) => {
    const state = getState();
    const { chainApiDisconnected, chainApi } = state.chain;
    if( chainApi && !chainApiDisconnected ){
      chainApi.disconnect();
      dispatch(disconnectChain());
    }
  }
}
