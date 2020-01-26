import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Abi } from '@polkadot/api-contract';
import { RootStore } from './Root';
import PutCodeModalButton from './PutCodeModalButton';
import InstantiateModalButton from './InstantiateModalButton';
import PlasmInstantiateModalButton from './PlasmInstantiateModalButton';
import CallContractModalButton from './CallContractModalButton';
import { ApiPromise } from '@polkadot/api';
import LocalWasmTesterModalButton from '../components/LocalWasmTesterModalButton'

export type CodesObject = {
  [s: string]: {
    codeHash: string;
    name: string;
    abi: Abi;
  };
}

export type InstancesObject = {
  [s: string]: {
    address: string;
    codeHash: string;
    name: string;
  };
}

type propType = {
  api: ApiPromise | null;
  apiIsReady: boolean,
  wasm: Uint8Array | null;
  metadata: string | null;
}

const ChainStatus = ( {api, apiIsReady, wasm, metadata}:propType ) => {

  const [codes,setCodes] = useState<CodesObject>({})
  const [instances,setInstances] = useState({})
  const [abi,setAbi] = useState<Abi | null>(null);

  const selectedChainId = useSelector((state: RootStore) => state.chain.selectedChainId);

  useEffect(()=>{
    setCodes({});
    setInstances({});
  },[selectedChainId])

  useEffect(()=>{
    console.log("new codes:\n",codes)
  },[codes])

  useEffect(()=>{
    console.log("new instances:\n",instances)
  },[instances])

  useEffect(()=>{
    if(apiIsReady&&api&&api.registry&&metadata!=null){
      const _abi = new Abi(api.registry,JSON.parse(metadata));
      console.log(_abi);
      setAbi(_abi);
    }
  },[apiIsReady,api,metadata])

  if(!api || !apiIsReady){
    return (<p>Chain is not connected.</p>)
  }else if(!(api.tx) || (!api.tx.contract && !api.tx.contracts) ) {
    return (<p>No contract module in this chain.</p>)
  }else {
    return (<>
      <p>Able to use contract module.</p>
      {(!!abi&&!!wasm)
        ?<PutCodeModalButton api={api} abi={abi} wasm={wasm} codes={codes} setCodes={setCodes} />
        :[]
      }
      {(!!abi&&!!wasm)
        ?<LocalWasmTesterModalButton label="Test wasm in local" abi={abi} wasm={wasm} />
        :[]
      }
    {Object.keys(codes).length>0?
      (selectedChainId==="Plasm"
      ?<InstantiateModalButton
          api={api}
          codes={codes}
          instances={instances}
          setInstances={setInstances}
          selectedChainId={selectedChainId}
      />
      :<PlasmInstantiateModalButton
          api={api}
          codes={codes}
          instances={instances}
          setInstances={setInstances}
          selectedChainId={selectedChainId}
      />)
    :[]}
    {Object.keys(instances).length>0?<CallContractModalButton
        api={api}
        codes={codes}
        instances={instances}
        selectedChainId={selectedChainId}
    />:[]}
    </>)
  }
}

export default ChainStatus
