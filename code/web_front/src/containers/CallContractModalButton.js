import React, { useState, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField';
import AccountDropdown from './AccountDropdown'
import TxButton from './TxButton'
import Dropdown from '../components/Dropdown'
import CallContractDropdown from '../components/CallContractDropdown'
import Modal from '../components/ModalTemplate'
import { addConsoleLine } from '../actions'

const CallContractModalButton = ({api,codes,instances}) => {
  const dispatch = useDispatch();
	const setResult = (x) => dispatch(addConsoleLine(x))

  const [gasLimit, setGasLimit] = useState(500000)
  const [value, setValue] = useState(0)
  const [instance,setInstance] = useState(null);
  const [abi,setAbi] = useState();
  const [callMessage, setCallMessage] = useState();
  const [returnVal, setReturnVal] = useState(null);

  const modalRef = useRef();

  useEffect(() => {
    setCallMessage(null)
    if(!!instance){
      setAbi(codes[instance.codeHash].abi)
    }
  },[instance,codes])

  const onSend = ({ events = [], status}, result ) => {
    modalRef.current.handleClose()

    setReturnVal(result);

    setResult('Transaction status: ' + status.type);

    if (status.isFinalized) {
      setResult('Completed at block hash: \n'+ status.asFinalized.toString());
      setResult('Events:');

      events.forEach(({ phase, event: { data, method, section } }) => {
        setResult('\t'+phase.toString()+`: ${section}.${method} `+data.toString());
      });
      // process.exit(0);
    }
  }

  return(<>
    <Button label="Account" variant="contained" color="primary" style = {{marginBottom:"10px",width:"100%"}} onClick={()=>modalRef.current.handleOpen()}>
      call contract
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
        label="Value"
        type="number"
        defaultValue={value}
        InputLabelProps={{shrink: true}}
        onChange={e=>{setValue(e.target.value)}}
        variant="filled"
        style = {{marginBottom:"10px",width:"100%"}}
      />

      <Dropdown
        label="Instance"
        value={instance}
        valuesList={Object.values(instances)}
        setValue={setInstance}
        display={(x)=>{return `${x.name}(${x.address})`}}
      />

      { (!!abi)?
      <CallContractDropdown
        abi={abi}
        setCallMessage={setCallMessage}
      />:[]}
      
      {!!returnVal?"Return: "+returnVal.toString():[]}
      {!!instance?
      <TxButton
        label={"send"}
        tx={api.tx.contract?'contract.call':'contracts.call'}
        params={[
          instance.address,
          value,
          gasLimit,
          !!callMessage?callMessage:[]
        ]}
        setReturnVal={setReturnVal}
        onSend={onSend}
        style = {{marginBottom:"10px",width:"100%"}}
      />
      :["cannot send"]}
    </Modal>
  </>)
}

export default CallContractModalButton
