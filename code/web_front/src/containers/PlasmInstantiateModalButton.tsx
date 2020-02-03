import React, { useState, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField';
import { ApiPromise } from '@polkadot/api';
import { SubmittableResultValue } from '@polkadot/api/types';
import { getTypeDef } from '@polkadot/types';
import Param from '@polkadot/react-params/Param';
import { RawParamOnChangeValue } from '@polkadot/react-params/types';
import getInitValue from '@polkadot/react-params/initValue';
import AccountDropdown from './AccountDropdown'
import TxButton from './TxButton'
import Modal, { ModalTemplateHandler } from '../components/ModalTemplate'
import Dropdown from '../components/Dropdown'
import ConstructorDropdown from '../components/ConstructorDropdown'
import { addConsoleLine } from '../actions'
import { CodesObject, InstancesObject } from './ChainStatus';

type PropType = {
  api: ApiPromise;
  codes: CodesObject;
  instances: InstancesObject;
  setInstances: React.Dispatch<React.SetStateAction<InstancesObject>>;
  selectedChainId: string;
}

const ParametersType = getTypeDef('{"canBeNominated": "bool", "optionExpied" : "u128", "optionP" : "u32" }')

const PlasmInstantiateModalButton = ({api,codes,instances,setInstances,selectedChainId} : PropType) => {
  const dispatch = useDispatch();
	const setResult = (x) => dispatch(addConsoleLine(x))

  const [endowment,setEndowment] = useState(0);
  const [gasLimit, setGasLimit] = useState(500000)
  const [codeHash, setCodeHash] = useState<string|null>(null)
  const [parameters, setParameters] = useState(null);
  const [constructorMessage, setConstructorMessage] = useState<Uint8Array|null>(null)
  const [instanceName, setInstanceName] = useState("")

  const modalRef = useRef({} as ModalTemplateHandler);

  useEffect(()=>{
    setCodeHash(null);
  },[selectedChainId]);

  useEffect(()=>{
    var contractObj = api.consts.contracts;
    setEndowment(contractObj.contractFee.toNumber()+contractObj.creationFee.toNumber())  
  },[api]);

  useEffect(()=>{
    setConstructorMessage(null)
  },[codeHash])

  const onInstantiate = ({ events = [], status }: SubmittableResultValue) :void => {
    if(codeHash!==null && instanceName !== null){

      modalRef.current.handleClose()
      setResult('Transaction status: ' + status.type);

      if (status.isFinalized && (codeHash!==null && instanceName !== null))
      {
        setResult('Completed at block hash: \n'+ status.asFinalized.toString());
        setResult('Events:');
        events.forEach(({ phase, event: { data, method, section } }) => {
          if((section==='contract'||section==='contracts')&&method==='Instantiated'){
            setInstances({...instances, [data[1].toString()] : {address:data[1].toString(),codeHash:codeHash, name:instanceName}});
          }
          setResult('\t'+phase.toString()+`: ${section}.${method} `+data.toString());
        });
      }
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
        onChange={(e:any)=>{setGasLimit(e.target.value)}}
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
      { (codeHash!==null)?
      <><ConstructorDropdown
        abi={codes[codeHash].abi}
        setConstructorMessage={setConstructorMessage}
        />
      </>
      :[]
      }

      <TextField
        label="Name of instance"
        type="text"
        defaultValue={instanceName}
        InputLabelProps={{shrink: true}}
        onChange={e=>{setInstanceName(e.target.value)}}
        variant="filled"
        style = {{marginBottom:"10px",width:"100%"}}
      />

      <div className="ui--Params-Content">
        <div className="ui--Param-composite">
          <Param
            name="Parameters"
            onChange={(e:RawParamOnChangeValue)=>{setParameters(e.value);}}
            type={ParametersType}
            defaultValue={getInitValue(ParametersType)}
          />
        </div>
      </div>

      <TxButton
        label={"send"}
        tx={'contracts.instantiate'}
        params={[
          endowment
          ,gasLimit
          ,Object.keys(codes)[0]
          ,!!constructorMessage?constructorMessage:[]
          ,parameters
        ]}
        onSend={onInstantiate}
        style={{display:!Object.keys(codes).length?'none':''}}
      />
    </Modal>
  </>)
}

export default PlasmInstantiateModalButton
