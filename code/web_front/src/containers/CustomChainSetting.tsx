import React, { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, TextField } from '@material-ui/core'
import { setCustom, startSelectedChain, selectChainById } from '../actions'
import { RootStore } from './Root'

type PropType = {
    handleClose: Function;
}

const CustomChainSetting = ({handleClose}: PropType) => {

    const dispatch = useDispatch()
    const customChain = useSelector((state: RootStore) => state.chain.items.custom);
    const setCustomWs = (ws:string) => dispatch(setCustom(ws))
    const setCustomType = (type:object) => dispatch(setCustom(customChain.ws_provider,type))

    const [typeInputError,setTypeInputError] = useState(false);
    const wsInputRef = useRef({} as HTMLInputElement);
    const typeInputRef = useRef({} as HTMLInputElement);

    const onClick = () => {
        setTypeInputError(false)
        try{
            let customTypeObject = JSON.parse(typeInputRef.current.value);
            setCustomWs(wsInputRef.current.value)
            setCustomType(customTypeObject);
        }catch (e) {
            setTypeInputError(true)
            return;
        }
        handleClose();
        dispatch(selectChainById('custom'))
        dispatch(startSelectedChain())
    }

    return(<>
    <TextField
        label="ws_provider"
        type="text"
        defaultValue={customChain.ws_provider}
        inputRef={wsInputRef}
        InputLabelProps={{shrink: true}}
        variant="filled"
        style = {{marginBottom:"10px",width:"100%"}}
    />
    <TextField
        label="custom type"
        type="text"
        defaultValue={JSON.stringify(customChain.type)}
        inputRef={typeInputRef}
        error={typeInputError}
        onChange={(e)=>{setTypeInputError(false)}}
        multiline={true}
        InputLabelProps={{shrink: true}}
        variant="filled"
        style = {{marginBottom:"10px",width:"100%"}}
    />
    <Button variant="contained" color="primary" onClick={onClick}>
        Set and Connect
    </Button>
    </>)
}

export default CustomChainSetting