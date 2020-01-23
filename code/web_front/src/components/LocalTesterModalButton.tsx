import React, { useRef, useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import Modal, { ModalTemplateHandler } from './ModalTemplate'
import { Abi } from '@polkadot/api-contract'

type PropType = {
    label: string;
    wasm: Uint8Array | null;
    metadata: string | null;
}

const LocalWasmSelectModalButton = ({ label, wasm, metadata }: PropType) => {

    const [_abi, setAbi] = useState<Abi | null>(null);
    const modalRef = useRef({} as ModalTemplateHandler);

    useEffect(()=>{
        if(metadata!=null){
            const _abi = new Abi(null as any, JSON.parse(metadata));
            setAbi(_abi);
        }
    },[metadata])

    return (<>
        <Button style={{ marginBottom: "10px", width: "100%" }} color="primary" variant="contained" onClick={() => modalRef.current.handleOpen()}>
            {label}
        </Button>
        <Modal>

        </Modal>
    </>)
}

export default LocalWasmSelectModalButton;
