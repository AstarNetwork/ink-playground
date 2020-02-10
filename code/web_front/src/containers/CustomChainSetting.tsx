import React, { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, TextField, FormControl, Select, InputLabel, MenuItem } from '@material-ui/core'
import { RegistryTypes } from '@polkadot/types/types'
import { setCustom, startSelectedChain } from '../actions'
import { RootStore } from './Root'
import { ChainId } from '../Chains'

type PropType = {
    handleClose: Function;
}

const CustomChainSetting = ({handleClose}: PropType) => {

    const dispatch = useDispatch()
    const customChain = useSelector((state: RootStore) => state.chain.selectedChain);
    const chains = useSelector((state:RootStore) => state.chain.items);
    
    const [typeInputError,setTypeInputError] = useState(false);
    const wsInputRef = useRef({} as HTMLInputElement);
    const typeInputRef = useRef({} as HTMLInputElement);
    const nameInputRef = useRef({} as HTMLInputElement);
    const [chainId,setChainId] = useState(customChain.id);

    function handleChange(event: React.ChangeEvent<{ value: unknown }>) {
        const id = event.target.value as ChainId;
        setChainId(id);
        wsInputRef.current.value = chains[id].ws_provider
        typeInputRef.current.value = JSON.stringify(chains[id].types)
        nameInputRef.current.value = chains[id].name
    }

    const onClick = () => {
        setTypeInputError(false)
        try{
            let customTypeObject = JSON.parse(typeInputRef.current.value) as RegistryTypes;
            dispatch(setCustom({...customChain,
                id:chainId,
                ws_provider:wsInputRef.current.value,
                types:customTypeObject,
                name:nameInputRef.current.value,
            }))
        }catch (e) {
            setTypeInputError(true)
            return;
        }
        handleClose();
        dispatch(startSelectedChain())
    }

    return(<>
    <FormControl variant="filled" style = {{marginBottom:"30px",width:"100%"}}>
        <InputLabel>Default Chains</InputLabel>
        <Select
          value={chainId}
          onChange={handleChange}
        >
        {Object.values(chains).map((chain_, index) => {
            return (
                <MenuItem key={index} value={chain_.id} >{chain_.name}</MenuItem>
            )
        })}
        </Select>
    </FormControl>
    
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
        defaultValue={JSON.stringify(customChain.types)}
        inputRef={typeInputRef}
        error={typeInputError}
        onChange={(e)=>{setTypeInputError(false)}}
        multiline={true}
        InputLabelProps={{shrink: true}}
        variant="filled"
        style = {{marginBottom:"10px",width:"100%"}}
    />
    <TextField
        label="chain_name"
        type="text"
        defaultValue={customChain.name}
        inputRef={nameInputRef}
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