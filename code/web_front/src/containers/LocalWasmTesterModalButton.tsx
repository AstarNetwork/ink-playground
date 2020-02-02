import React, { useRef, useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import Modal, { ModalTemplateHandler } from '../components/ModalTemplate'
import { Abi } from '@polkadot/api-contract'
import { createType, TypeRegistry } from '@polkadot/types'
import { ImportObject } from '../wasmExecuter'
import ConstructorDropdown from '../components/ConstructorDropdown'
import CallContractDropdown from '../components/CallContractDropdown'
import { useSelector } from 'react-redux'
import { RootStore } from './Root'


type PropType = {
    label: string;
    wasm: Uint8Array | null;
    metadata: string | null;
}

const registry = new TypeRegistry();

const LocalWasmTesterModalButton = ({ label, wasm, metadata }: PropType) => {

    const account = useSelector((state: RootStore) => state.account.selectedAccount);

    const [abi, setAbi] = useState<Abi | null>(null);
    const [importObject,setImportObject] = useState<ImportObject | null>(null);
    const [wasmInstance, setWasmInstance] = useState<WebAssembly.WebAssemblyInstantiatedSource | null>(null);
    const [constructorMessage, setConstructorMessage] = useState<Uint8Array | null>(null)
    const [callContractMessage, setCallContractMessage] = useState<Uint8Array | null>(null)
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

    function deploy(message){
        async function main() {
            if (abi !== null && wasm !== null && account !== null) {
                console.log(createType(registry,'AccountId',account.publicKey));
                var _importObject = new ImportObject(createType(registry,'AccountId',account.publicKey));
                setImportObject(_importObject)
                const _wasmInstance = await WebAssembly.instantiate(wasm, _importObject as any);
                console.log('wasm instance created');
                setWasmInstance(_wasmInstance);
                if (!!importObject){
                    console.log('already deployed');
                    return;
                }
                const exportedFunc = _wasmInstance.instance.exports.deploy as Function;
                _importObject.scratch_buf.set(message.subarray(1,message.length));
                _importObject.scratch_buf_len = message.length-1;
                console.log('[INPUT] scratch_buf:');
                console.log(_importObject.scratch_buf.subarray(0,_importObject.scratch_buf_len));
                const result = exportedFunc();
                console.log('[OUTPUT] scratch_buf:');
                console.log(_importObject.scratch_buf.subarray(0,_importObject.scratch_buf_len));
                console.log('deploy: '+result);
            }
        }
        main();
    }

    function call(message){
        async function main() {
            if (abi !== null && wasm !== null && account !== null) {
                if (wasmInstance === null || importObject === null){
                    console.log('you have to deploy before calling');
                    return;
                }else{
                    const exportedFunc = wasmInstance.instance.exports.deploy as Function;
                    importObject.scratch_buf.set(message.subarray(1,message.length));
                    importObject.scratch_buf_len = message.length-1;
                    console.log('[INPUT] scratch_buf:');
                    console.log(importObject.scratch_buf.subarray(0,importObject.scratch_buf_len));
                    const result = exportedFunc();
                    console.log('[OUTPUT] scratch_buf:');
                    console.log(importObject.scratch_buf.subarray(0,importObject.scratch_buf_len));
                    console.log('call: '+result);
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
            <Button style={{ marginBottom: "10px", width: "100%" }} color="secondary" variant="contained" onClick={()=>{setImportObject(null);setWasmInstance(null);}} >
                reset
            </Button>
            {!!abi?
            <ConstructorDropdown
                abi={abi}
                setConstructorMessage={setConstructorMessage}
            />:["Abi is not set"]}
            <Button
                style={{ marginBottom: "10px", width: "100%" }}
                color="primary"
                variant="contained"
                onClick={()=>{
                    if(constructorMessage!==null){
                        deploy(constructorMessage);
                        modalRef.current.handleClose();
                    }
                }}
            >deploy</Button>
            <span>call</span>
            {!!abi?
            <CallContractDropdown
                abi={abi}
                setCallMessage={setCallContractMessage}
            />:["Abi is not set"]}
            <Button
                style={{ marginBottom: "10px", width: "100%" }}
                color="primary"
                variant="contained"
                onClick={()=>{
                    if(callContractMessage!==null){
                        call(callContractMessage);
                        modalRef.current.handleClose();
                    }
                }}
            >call</Button>
            
        </Modal>
    </>)
}

export default LocalWasmTesterModalButton;
