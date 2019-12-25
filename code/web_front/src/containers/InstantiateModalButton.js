import React, { useState, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField';
import AccountDropdown from './AccountDropdown'
import TxButton from './TxButton'
import Modal from '../components/ModalTemplate'
import Dropdown from '../components/Dropdown'
import ConstructorDropdown from '../components/ConstructorDropdown'
import { addConsoleLine } from '../actions'

const InstantiateModalButton = ({api,codes,instances,setInstances}) => {
  const dispatch = useDispatch();
	const setResult = (x) => dispatch(addConsoleLine(x))

  const [gasLimit, setGasLimit] = useState(500000)
  const [codeHash, setCodeHash] = useState(null)
  const [constructorMessage, setConstructorMessage] = useState(null)
  const [instanceName, setInstanceName] = useState("")
  const [endowment,setEndowment] = useState(0);

  const modalRef = useRef(null);

  useEffect(()=>{
    if(!api||!api.consts)
      return
    var contractObj = (!!api.consts.contracts)?api.consts.contracts:api.consts.contract
    setEndowment(contractObj.contractFee.toNumber()+contractObj.creationFee.toNumber())
  },[api]);

  useEffect(()=>{
    setConstructorMessage(null)
  },[codeHash])

  const onInstantiate = ({ events = [], status }) => {
    modalRef.current.handleClose()

    setResult('Transaction status: ' + status.type);

    if (status.isFinalized) {
      setResult('Completed at block hash: \n'+ status.asFinalized.toString());
      setResult('Events:');

      events.forEach(({ phase, event: { data, method, section } }) => {
        if((section==='contract'||section==='contracts')&&method==='Instantiated'){
          setInstances({...instances, [data[1].toString()] : {address:data[1].toString(),codeHash:codeHash,name:instanceName}});
        }
        setResult('\t'+phase.toString()+`: ${section}.${method} `+data.toString());
      });
      // process.exit(0);
    }
  }

  return(<>
    <Button variant="contained" color="primary" style = {{marginBottom:"10px",width:"100%"}} onClick={()=>modalRef.current.handleOpen()}>
      Instantiate
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

      <Dropdown
        label="CodeHash"
        value={codeHash}
        valuesList={Object.keys(codes)}
        setValue={setCodeHash}
        display={(x)=>{return `${codes[x].name}(${x})`}}
      />
      { (!!codes&& !!codes[codeHash]&& !!codes[codeHash].abi &&!!codes[codeHash].abi.abi)?
      <ConstructorDropdown
        abi={codes[codeHash].abi}
        setConstructorMessage={setConstructorMessage}
      />:[]}

      <TextField
        label="Name of instance"
        type="text"
        defaultValue={instanceName}
        InputLabelProps={{shrink: true}}
        onChange={e=>{setInstanceName(e.target.value)}}
        variant="filled"
        style = {{marginBottom:"10px",width:"100%"}}
      />

      <TxButton
        label={"send"}
        tx={api.tx.contract?'contract.instantiate':'contracts.instantiate'}
        params={[
          endowment
          ,gasLimit
          ,Object.keys(codes)[0]
          ,!!constructorMessage?constructorMessage:[]
        ]}
        onSend={onInstantiate}
        style={{display:!Object.keys(codes).length?'none':''}}
      />
    </Modal>
  </>)
}

export default InstantiateModalButton
