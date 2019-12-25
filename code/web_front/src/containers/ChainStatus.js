import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Abi } from '@polkadot/api-contract';
import PutCodeModalButton from './PutCodeModalButton';
import InstantiateModalButton from './InstantiateModalButton';
import CallContractModalButton from './CallContractModalButton';

const ChainStatus = ( {api, apiIsReady, wasm, metadata} ) => {

  const [codes,setCodes] = useState({})
  const [instances,setInstances] = useState({})

  const [abi,setAbi] = useState(null);

  useEffect(()=>{
    console.log("new codes:\n",codes)
  },[codes])

  useEffect(()=>{
    console.log("new instances:\n",instances)
  },[instances])

  useEffect(()=>{
    if(apiIsReady&&api&&api.registry&&metadata!=null){
      const _abi = new Abi(api.registry,JSON.parse(metadata));
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
      <PutCodeModalButton api={api} abi={abi} wasm={wasm} codes={codes} setCodes={setCodes} />
    {Object.keys(codes).length>0?<InstantiateModalButton
        api={api}
        codes={codes}
        instances={instances}
        setInstances={setInstances}
      />:[]}
    {Object.keys(instances).length>0?<CallContractModalButton
        api={api}
        codes={codes}
        instances={instances}
    />:[]}
    </>)
  }
}

ChainStatus.propTypes = {
  api: PropTypes.object,
  apiIsReady: PropTypes.bool.isRequired,
  wasm: PropTypes.object,
  metadata: PropTypes.string,
}

export default ChainStatus
