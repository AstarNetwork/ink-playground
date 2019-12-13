import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { compactAddLength, u8aToU8a } from '@polkadot/util';
import { Abi } from '@polkadot/api-contract';
import TxButton from './TxButton';
import { addConsoleLine } from '../actions'

const ChainStatus = ( {api, apiIsReady, wasm, metadata} ) => {
  const dispatch = useDispatch();
	const setResult = (x) => dispatch(addConsoleLine(x))

  const [codes,setCodes] = useState({})
  const [instances,setInstances] = useState({})

  const [abi,setAbi] = useState(null);

  useEffect(()=>{
    if(apiIsReady&&api&&api.registry&&metadata!=null){
      const _abi = new Abi(api.registry,JSON.parse(metadata));
      console.log(_abi);
      setAbi(_abi);
    }
  },[metadata])



  const onPutCode = ({ events = [], status }) => {
    setResult('Transaction status: ' + status.type);

    if (status.isFinalized) {
      setResult('Completed at block hash: \n'+ status.asFinalized.toString());
      setResult('Events:');

      events.forEach(({ phase, event: { data, method, section } }) => {
        if((section==='contract'||section==='contracts')&&method==='CodeStored'){
          setResult('\tcodeHash: '+data[0].toString());
          setCodes({...codes, [data[0].toString()]:{name:"dummy"}});
        }else{
          setResult('\t'+phase.toString()+`: ${section}.${method} `+data.toString());
        }
      });
      // process.exit(0);
    }
  }

  const onInstantiate = ({ events = [], status }) => {
    setResult('Transaction status: ' + status.type);

    if (status.isFinalized) {
      setResult('Completed at block hash: \n'+ status.asFinalized.toString());
      setResult('Events:');

      events.forEach(({ phase, event: { data, method, section } }) => {
        if((section==='contract'||section==='contracts')&&method==='Instantiated'){
          setInstances({...instances, [data[1].toString()] : {name:"dummy"}});
        }
        setResult('\t'+phase.toString()+`: ${section}.${method} `+data.toString());
      });
      // process.exit(0);
    }
  }

  if(!api || !apiIsReady){
    return (<p>Chain is not connected.</p>)
  }else if(!(api.tx) || (!api.tx.contract && !api.tx.contracts) ) {
    return (<p>No contract module in this chain.</p>)
  }else {
    return (<>
      <p>Able to use contract module.</p>
      <TxButton
        label={"put code"}
        tx={api.tx.contract?'contract.putCode':'contracts.putCode'}
        params={[500000,compactAddLength(wasm?wasm:[])]}
        onSend={onPutCode}
        style={{marginBottom:"10px"}}
      />
      <TxButton
        label={"instantiate"}
        tx={api.tx.contract?'contract.instantiate':'contracts.instantiate'}
        params={[(api.consts.contracts.contractFee.toNumber()+api.consts.contracts.creationFee.toNumber())
          ,500000
          ,Object.keys(codes)[0]
          ,abi?abi.constructors[1]():[]
        ]}
        onSend={onInstantiate}
        style={{display:!Object.keys(codes).length?'none':''}}
      />

    </>)
  }
}

ChainStatus.propTypes = {
  api: PropTypes.object,
  apiIsReady: PropTypes.bool.isRequired,
}

export default ChainStatus
