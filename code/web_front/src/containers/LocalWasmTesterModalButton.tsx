import React, { useRef, useState, useEffect, useReducer } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Button from '@material-ui/core/Button'
import { Abi } from '@polkadot/api-contract'
import { createType, TypeRegistry, Raw } from '@polkadot/types'
import { TypeDef } from '@polkadot/types/codec/types'
import { formatData } from '@polkadot/api-contract/util'
import { ImportObject } from '../wasmExecuter'
import Modal, { ModalTemplateHandler } from '../components/ModalTemplate'
import ConstructorDropdown from '../components/ConstructorDropdown'
import CallContractDropdown from '../components/CallContractDropdown'
import { addConsole as _addConsole } from '../actions'
import { RootStore } from './Root'

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

    const [abi, setAbi] = useState<Abi | null>(null);
    const [importObject,setImportObject] = useState<ImportObject | null>(null);
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

    function deploy(message :Uint8Array){
        async function main(){
            if (!!abi && !!wasm && !!account && !importObject && !wasmInstance) {
                const _importObject = new ImportObject(createType(abi.registry,'AccountId',account.publicKey));
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
                importObject.scratch_buf.set(message.subarray(1,message.length));
                importObject.scratch_buf_len = message.length-1;
                console.log('[INPUT] scratch_buf:');
                console.log(importObject.scratch_buf.subarray(0,importObject.scratch_buf_len));
                const result = exportedFunc();
                addConsole(`[CALLED] ${funcName}: ${result===0?'success':'error'}\n`);
                const retType = returnType[funcName];
                if(retType !== null){
                    addConsole('[OUTPUT]\n');
                    const rawOutput = new Raw(abi.registry,importObject.scratch_buf.subarray(0,importObject.scratch_buf_len));
                    const output = formatData(abi.registry, rawOutput, retType);
                    addConsole(`${output.toString()}: ${retType.displayName}\n`);
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
            <div style={{width:"50vh"}} ><span>instantiate</span></div>
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
            <span>call</span>
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
