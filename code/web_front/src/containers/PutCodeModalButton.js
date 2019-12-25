import React, { useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField';

import { compactAddLength } from '@polkadot/util'
import AccountDropdown from './AccountDropdown'

import TxButton from './TxButton'
import Modal from '../components/ModalTemplate'
import { addConsoleLine } from '../actions'

const PutCodeModal = ({api,abi,wasm,codes,setCodes}) => {
  const dispatch = useDispatch();
	const setResult = (x) => dispatch(addConsoleLine(x))

  const [gasLimit, setGasLimit] = useState(500000)
  const [codeName, setCodeName] = useState("")

  const modalRef = useRef(null);

  const onPutCode = ({ events = [], status }) => {
    modalRef.current.handleClose()

    setResult('Transaction status: ' + status.type);
    if (status.isFinalized) {
      setResult('Completed at block hash: \n'+ status.asFinalized.toString());
      setResult('Events:');
      events.forEach(({ phase, event: { data, method, section } }) => {
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
    <Button label="Account" variant="contained" color="primary" style = {{marginBottom:"10px",width:"100%"}} onClick={()=>modalRef.current.handleOpen()}>
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
        onChange={e=>{setGasLimit(e.target.value)}}
        variant="filled"
        style = {{marginBottom:"10px",width:"100%"}}
      />

      <TextField
        label="Name of code"
        type="text"
        defaultValue={codeName}
        InputLabelProps={{shrink: true}}
        onChange={e=>{setCodeName(e.target.value)}}
        variant="filled"
        style = {{marginBottom:"10px",width:"100%"}}
      />
      {(!!(api.tx))?
      <TxButton
        label={"send"}
        tx={api.tx.contract?'contract.putCode':'contracts.putCode'}
        params={[gasLimit,compactAddLength(wasm?wasm:[])]}
        onSend={onPutCode}
        style = {{marginBottom:"10px",width:"100%"}}
      />
      :["cannot send"]}
    </Modal>
  </>)
}

export default PutCodeModal
