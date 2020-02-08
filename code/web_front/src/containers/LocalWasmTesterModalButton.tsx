import React, { useRef, useState, useEffect, useReducer } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Button from '@material-ui/core/Button'
import { Abi } from '@polkadot/api-contract'
import { createType, TypeRegistry, Raw, u8 } from '@polkadot/types'
import { Vec, Struct } from '@polkadot/types/codec';
import { TypeDef } from '@polkadot/types/codec/types'
import { KeyringPair } from '@polkadot/keyring/types'
import { formatData } from '@polkadot/api-contract/util'
import { ImportObject } from '../wasmExecuter'
import Modal, { ModalTemplateHandler } from '../components/ModalTemplate'
import ConstructorDropdown from '../components/ConstructorDropdown'
import CallContractDropdown from '../components/CallContractDropdown'
import { addConsole as _addConsole, selectAccount } from '../actions'
import { RootStore } from './Root'
import AccountDropdown from './AccountDropdown'

type ExportedFuncName = 'deploy'|'call' ;
type ContractReturnType = { [x in ExportedFuncName] : (TypeDef | null ) };
export type ActionType = {type: ExportedFuncName, payload: TypeDef | null}

const contractReturnTypeReducer = (state:ContractReturnType,action: ActionType) => {
    switch(action.type){
      case 'deploy':
        return {...state,deploy: action.payload};
      case 'call':
        return {...state,call: action.payload};
      default:
        return state;
    }
}

type PropType = {
    label: string;
    wasm: Uint8Array | null;
    metadata: string | null;
}

const registry = new TypeRegistry();

const LocalWasmTesterModalButton = ({ label, wasm, metadata }: PropType) => {
    const dispatch = useDispatch()

    const addConsole = (x:string) => dispatch(_addConsole(x));
    const account = useSelector((state: RootStore) => state.account.selectedAccount);
    const setAccount = (x:KeyringPair)=>dispatch(selectAccount(x))

    const [abi, setAbi] = useState<Abi | null>(null);
    const [importObject,setImportObject] = useState<ImportObject | null>(null);
    const [eventCount,setEventCount] = useState(0);
    const [wasmInstance, setWasmInstance] = useState<WebAssembly.WebAssemblyInstantiatedSource | null>(null);
    const [constructorMessage, setConstructorMessage] = useState<Uint8Array | null>(null)
    const [callContractMessage, setCallContractMessage] = useState<Uint8Array | null>(null)
    const [returnType, setReturnType] = useReducer(contractReturnTypeReducer,{deploy:null, call:null});
    // const [gasLimit, setGasLimit] = useState(500000)
    // const [endowment,setEndowment] = useState(0);

    const modalRef = useRef({} as ModalTemplateHandler);

    useEffect(()=>{
        if(metadata!=null){
            const _abi = new Abi(registry, JSON.parse(metadata));
            console.log(_abi);
            setAbi(_abi);
        }
    },[metadata])

    useEffect(()=>{
        if(!!importObject&&!!account&&!!abi){
            importObject.caller = createType(abi.registry,'AccountId',account.publicKey);
        }
    },[account,abi,importObject])

    useEffect(()=>{setEventCount(0)},[importObject,setEventCount]);

    useEffect(()=>{
        if(!!abi && !!abi.abi.contract.events && !!importObject && importObject.events.length > eventCount) {
            setEventCount((c)=>c+1);
            const event_data = importObject.events[importObject.events.length-1].data;
            const index = event_data[0];
            if(!!abi.abi.contract.events&&!!abi.abi.contract.events[index]){
                const eventTypeArgs = abi.abi.contract.events[index].args;
                const eventTypeObject = eventTypeArgs.reduce((result,current,_index)=>{
                    result[current.name] = current.type.type;
                    return result;
                },{})
                const eventStruct = new Struct(abi.registry,eventTypeObject,event_data.subarray(1));
                addConsole(`[EVENT]\n${JSON.stringify(eventStruct,null,' ')}\n`);
            }
        }
    })

    function deploy(message :Uint8Array){
        async function main(){
            if (!!abi && !!wasm && !!account && !importObject && !wasmInstance) {
                const _importObject = new ImportObject(createType(abi.registry,'AccountId',account.publicKey),abi);
                setImportObject(_importObject);
                const _wasmInstance = await WebAssembly.instantiate(wasm, _importObject as any);
                setWasmInstance(_wasmInstance);
                addConsole('wasm instance created\n');
                exported_func(_wasmInstance, _importObject, 'deploy', message);
            }
        }
        main();
    }

    function call(wasmInstance:WebAssembly.WebAssemblyInstantiatedSource, importObject :ImportObject ,message :Uint8Array){
        exported_func(wasmInstance, importObject, 'call', message);
    }

    function exported_func(wasmInstance:WebAssembly.WebAssemblyInstantiatedSource, importObject :ImportObject, funcName:'deploy'|'call', message:Uint8Array){
        async function main() {
            if (!!abi && !!wasm && !!account && !!wasmInstance && !!importObject ) {
                const exportedFunc = wasmInstance.instance.exports[funcName] as Function;
                //prefix is written by scale codec (compact)
                let vec: Vec<u8> = new Vec(abi.registry, 'u8', message);
                let messageBody = new Uint8Array(vec.length);
                vec.forEach((e,i)=>{messageBody[i] = e.toNumber()});
                importObject.scratch_buf.set(messageBody);
                importObject.scratch_buf_len = messageBody.length;
                console.log('[INPUT] scratch_buf:');
                console.log(importObject.scratch_buf.subarray(0,importObject.scratch_buf_len));
                const result = exportedFunc();
                addConsole(`[CALLED] ${funcName}: ${result===0?'success':'error'}\n`);
                const retType = returnType[funcName];
                if(result === 0 && retType !== null){
                    addConsole('[OUTPUT]\n');
                    const rawOutput = new Raw(abi.registry,importObject.scratch_buf.subarray(0,importObject.scratch_buf_len));
                    const output = formatData(abi.registry, rawOutput, retType);
                    addConsole(`${output.toString()}: ${retType.displayName}\n\n`);
                }else{
                    addConsole('\n');
                }
            }
        }
        main();
    }

    return (<>
        <Button style={{ marginBottom: "10px", width: "100%" }} color="secondary" variant="contained" onClick={() => modalRef.current.handleOpen()}>
            {label}
        </Button>
        <Modal ref={modalRef}>
            <h3>caller</h3>
            <AccountDropdown
                account={account}
                setAccount={setAccount}
            />
            <div style={{width:"50vh"}} ><h3>instantiate</h3></div>
            <Button style={{ marginBottom: "10px", width: "100%" }} color="secondary" variant="contained"
                onClick={()=>{setImportObject(null);setWasmInstance(null);addConsole('wasm instance deleted \n');}}
            >
                reset
            </Button>
            {!!abi?
            <ConstructorDropdown
                abi={abi}
                setConstructorMessage={setConstructorMessage}
                setReturnType={setReturnType}
            />:["Abi is not set"]}
            <Button
                style={{ marginBottom: "10px", width: "100%" }}
                color="primary"
                variant="contained"
                onClick={()=>{
                    if(constructorMessage!==null){
                        if(!account){
                            addConsole('[ERROR] account is not selected\n');
                        }else if(!!importObject || !!wasmInstance){
                            addConsole('[ERROR] alerady deployed\n');
                        }else{
                            deploy(constructorMessage);
                        }
                    }
                }}
            >deploy</Button>
            <h3>call</h3>
            {!!abi?
            <CallContractDropdown
                abi={abi}
                setCallMessage={setCallContractMessage}
                setReturnType={setReturnType}
            />:["Abi is not set"]}
            <Button
                style={{ marginBottom: "10px", width: "100%" }}
                color="primary"
                variant="contained"
                onClick={()=>{
                    if(callContractMessage!==null){
                        if(!!wasmInstance && !!importObject){
                            call(wasmInstance, importObject, callContractMessage);
                        }else{
                            addConsole('[ERROR] called before instance created');
                        }
                    }
                }}
            >call</Button>
            
        </Modal>
    </>)
}

export default LocalWasmTesterModalButton;
