import React, { useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField';
import { compactAddLength } from '@polkadot/util'
import AccountDropdown from './AccountDropdown'

import TxButton from './TxButton'
import Modal, { ModalTemplateHandler } from '../components/ModalTemplate'
import { addConsoleLine } from '../actions'
import { ApiPromise } from '@polkadot/api';
import { SubmittableResultValue } from '@polkadot/api/types';
import { Abi } from '@polkadot/api-contract';
import { CodesObject } from './ChainStatus';

type PropType = {
  api: ApiPromise;
  abi: Abi;
  wasm : Uint8Array;
  codes : CodesObject;
  setCodes: React.Dispatch<React.SetStateAction<CodesObject>>;
}

const PutCodeModal = ({api,abi,wasm,codes,setCodes}: PropType) => {
  const dispatch = useDispatch();
	const setResult = (x:string) => dispatch(addConsoleLine(x))

  const [gasLimit, setGasLimit] = useState(500000)
  const [codeName, setCodeName] = useState("")

  const modalRef = useRef({} as ModalTemplateHandler);

  const onPutCode = ({ events , status }: SubmittableResultValue) => {
    modalRef.current.handleClose()

    setResult('Transaction status: ' + status.type);
    if (status.isFinalized) {
      setResult('Completed at block hash: \n'+ status.asFinalized.toString());
      setResult('Events:');
      events!.forEach(({ phase, event: { data, method, section } }) => {
        if((section==='contract'||section==='contracts')&&method==='CodeStored'){
          setResult('\tcodeHash: '+data[0].toString());
          const codeId = data[0].toString();
          setCodes({...codes, [codeId]:{codeHash:codeId,name:codeName,abi:abi}});
        }else{
          setResult('\t'+phase.toString()+`: ${section}.${method} `+data.toString());
        }
      });
      // process.exit(0);
    }

  }

  return(<>
    <Button style={{marginBottom:"10px",width:"100%"}} color = "primary" variant="contained" onClick={()=>modalRef.current.handleOpen()}>
      put code
    </Button>
    <Modal
      ref={modalRef}
    >
      <AccountDropdown/>
      <TextField
        label="Gas limit"
        type="number"
        defaultValue={gasLimit}
        InputLabelProps={{shrink: true}}
        onChange={(e:any)=>{setGasLimit(e.target.value)}}
        variant="filled"
        style = {{marginBottom:"10px",width:"100%"}}
      />

      <TextField
        label="Name of code"
        type="text"
        defaultValue={codeName}
        InputLabelProps={{shrink: true}}
        onChange={(e:any)=>{setCodeName(e.target.value)}}
        variant="filled"
        style = {{marginBottom:"10px",width:"100%"}}
      />
      {(!!(api.tx))?
      <TxButton
        label={"send"}
        tx={api.tx.contract?'contract.putCode':'contracts.putCode'}
        params={[gasLimit,compactAddLength(wasm)]}
        onSend={onPutCode}
        style = {{marginBottom:"10px",width:"100%"}}
      />
      :["cannot send"]}
    </Modal>
  </>)
}

export default PutCodeModal
