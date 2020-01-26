import React, { useRef, useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import Modal, { ModalTemplateHandler } from './ModalTemplate'
import { Abi } from '@polkadot/api-contract'
import { ImportObject } from '../wasmExecuter'
import ConstructorDropdown from './ConstructorDropdown'
import CallContractDropdown from './CallContractDropdown'


type PropType = {
    label: string;
    wasm: Uint8Array | null;
    abi: Abi | null;
}

const LocalWasmTesterModalButton = ({ label, wasm, abi }: PropType) => {

    const [importObject,setImportObject] = useState<ImportObject | null>(null);
    const [wasmInstance, setWasmInstance] = useState<WebAssembly.WebAssemblyInstantiatedSource | null>(null);
    const [constructorMessage, setConstructorMessage] = useState<Uint8Array | null>(null)
    const [callContractMessage, setCallContractMessage] = useState<Uint8Array | null>(null)

    // const [gasLimit, setGasLimit] = useState(500000)
    // const [endowment,setEndowment] = useState(0);
  
    const modalRef = useRef({} as ModalTemplateHandler);

    useEffect(() => {
        async function main() {
            if (wasm !== null) {
                var _importObject = new ImportObject();
                const _wasmInstance = await WebAssembly.instantiate(wasm, _importObject as any);
                setImportObject(_importObject)
                console.log('wasm instance created');
                setWasmInstance(_wasmInstance);
            }
        }
        main();
    }, [wasm])

    function exported_func(funcName: 'call'|'deploy', message: Uint8Array) {
        async function main() {
            console.log("`"+funcName+"` is called")
            if (abi !== null && wasmInstance !== null && importObject !== null) {
                const wasmI = wasmInstance;
                const exportedFunc = wasmI.instance.exports[funcName] as Function;
                const scratch_buf = new Uint8Array(importObject.env.memory.buffer);
                scratch_buf.set(message);
                importObject.scratch_buf_len = message.length;
                const result = exportedFunc();
                console.log(importObject.env.memory.buffer);
                console.log('instance.exports.'+funcName+': '+result);
            }
        }
        main();
    }

    return (<>
        <Button style={{ marginBottom: "10px", width: "100%" }} color="primary" variant="contained" onClick={() => modalRef.current.handleOpen()}>
            {label}
        </Button>
        <Modal ref={modalRef}>
            <div style={{width:"50vh"}} ><span>instantiate</span></div>
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
                        exported_func("deploy",constructorMessage);
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
                        exported_func("call",callContractMessage);
                        modalRef.current.handleClose();
                    }
                }}
            >call</Button>
            
        </Modal>
    </>)
}

export default LocalWasmTesterModalButton;
