import React, { useState, useReducer, useEffect, useRef } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { RawParamValues } from '@polkadot/react-params/types';
import '@polkadot/react-params/Params.css'
import GlobalStyle from '@polkadot/react-components/styles'
import { Abi } from '@polkadot/api-contract';
import { camelCase } from '../util/ChangeCase'
import { ActionType as ReturnTypeActionType } from '../containers/LocalWasmTesterModalButton';
import InputParams, { paramsReducer } from '../containers/InputParams'

type PropType = {
  abi: Abi;
  setCallMessage: React.Dispatch<React.SetStateAction<Uint8Array | null>>;
  setDisplay?: React.Dispatch<React.SetStateAction<string>>;
  setReturnType?: React.Dispatch<ReturnTypeActionType>;
}

const CallContractDropdown = ({abi, setCallMessage, setDisplay, setReturnType}: PropType) =>  {

  const [index,setIndex] = useState(0);
  const [params,setParams] = useReducer(paramsReducer, {});

  const prevParamsRef = useRef<typeof params>();
  useEffect(() => {
    prevParamsRef.current = params;
  });
  const prevParams = prevParamsRef.current;

  useEffect(()=>{
    setParams({type:'CLEAR'});
  },[abi,index])

  useEffect(()=>{
    if(!!abi&&!!abi.abi.contract.messages[index]){
      var name = camelCase(abi.abi.contract.messages[index].name);
    }else{return}
    if(!!abi.messages[name] && prevParams !== params){
      var func = abi.messages[name];
      if(func.args.length===Object.keys(params).length){
        var array: RawParamValues = [];
        for (var i = 0; i < func.args.length;i++){
          array.push(params[i]);
        }
        setCallMessage(func(...array));
        if(!!setReturnType){
          setReturnType({type:'call', payload: abi.abi.contract.messages[index].returnType});
        }
        if(!!setDisplay){
          const paramsDisplay = (array.length===0)
            ?`()`
            :`(${array.map((e,i)=>{return`\n  ${abi.abi.contract.messages[index].args[i].name}: ${e.toString()}`})}\n)`
          setDisplay(`${abi.abi.contract.messages[index].name}${paramsDisplay}\n`)
        }
      }
    }
  },[abi,setCallMessage,setReturnType,setDisplay,index,params,prevParams])

  return (
		<div>
      <GlobalStyle />
			<FormControl variant="filled" style={{width:"100%",marginBottom:"10px",marginLeft:"20px"}}>
				<InputLabel>{"function"}</InputLabel>
				<Select
					value={index}
					onChange={(e:any)=>{setIndex(e.target.value)}}
				>
					{abi.abi.contract.messages.map((_message, index) => (
							<MenuItem key={index} value={index}>
               {!(_message)?'':`${_message.name}(${_message.args.map((arg,index)=>(arg.name+':'+arg.type.displayName))})`}
              </MenuItem>
					))}

				</Select>
			</FormControl>
      <InputParams
        args={(index!==null)?abi.abi.contract.messages[index].args:null}
        params={params}
        setParams={setParams}
      />
		</div>
  );
}

export default CallContractDropdown;
