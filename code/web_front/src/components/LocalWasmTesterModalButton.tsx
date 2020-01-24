import React, { useRef, useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import Modal, { ModalTemplateHandler } from './ModalTemplate'
import { Abi } from '@polkadot/api-contract'
import { ImportObject } from '../wasmExecuter'
import ConstructorDropdown from './ConstructorDropdown'


type PropType = {
    label: string;
    wasm: Uint8Array | null;
    abi: Abi | null;
}

const LocalWasmTesterModalButton = ({ label, wasm, abi }: PropType) => {

    const [importObject,setImportObject] = useState<ImportObject | null>(null);
    const [wasmInstance, setWasmInstance] = useState<WebAssembly.WebAssemblyInstantiatedSource | null>(null);
    const [constructorMessage, setConstructorMessage] = useState<Uint8Array | null>(null)
    // const [gasLimit, setGasLimit] = useState(500000)
    // const [endowment,setEndowment] = useState(0);
  
    const modalRef = useRef({} as ModalTemplateHandler);

    useEffect(() => {
        async function main() {
            if (wasm !== null) {
                var _importObject = new ImportObject();
                setImportObject(_importObject)
                const _wasmInstance = await WebAssembly.instantiate(wasm, _importObject as any);
                console.log('wasm instance created');
                setWasmInstance(_wasmInstance);
            }
        }
        main();
    }, [wasm])

    function deploy(message: Uint8Array) {
        async function main() {
            console.log("deploy called")
            if (abi !== null && wasmInstance !== null && importObject !== null) {
                const result = wasmInstance;
                const deployFunc = result.instance.exports.deploy as Function;
                console.log(result.instance);
                const scratch_buf = importObject.scratch_buf;
                scratch_buf.set(message);
                importObject.scratch_buf_len = message.length;
                console.log(scratch_buf.subarray(0,message.length));
                console.log('instance.exports.deploy: '+deployFunc());
            }
        }
        main();
    }

    return (<>
        <Button style={{ marginBottom: "10px", width: "100%" }} color="primary" variant="contained" onClick={() => modalRef.current.handleOpen()}>
            {label}
        </Button>
        <Modal ref={modalRef}>
            <span>instantiate</span>
            {!!abi?
            <ConstructorDropdown
                abi={abi}
                setConstructorMessage={setConstructorMessage}
            />:["Abi is not set"]}
            {(constructorMessage!==null)?
            <Button
                style={{ marginBottom: "10px", width: "100%" }}
                color="primary"
                variant="contained"
                onClick={()=>{
                    console.log(constructorMessage);
                    deploy(constructorMessage);
                    modalRef.current.handleClose();
                }}
            >deploy</Button>
            :[]}
        </Modal>
    </>)
}

export default LocalWasmTesterModalButton;
