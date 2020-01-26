import React, { useState, useReducer, useEffect } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Param from '@polkadot/react-params/Param';
import { RawParamOnChangeValue, RawParamValues, RawParamValue } from '@polkadot/react-params/types';
import getInitValue from '@polkadot/react-params/initValue';
import '@polkadot/react-params/Params.css'
import GlobalStyle from '@polkadot/react-components/styles'
import { Abi } from '@polkadot/api-contract';

type ActionType = {
  index: number;
  payload: RawParamValue;
  type: 'SET';
} | {
  type: 'CLEAR';
}

const paramsReducer = (state:{[index:number]:RawParamValue},action: ActionType) => {
  switch(action.type){
    case 'SET':
      return {
        ...state,
        [action.index]: action.payload,
      };
    case 'CLEAR':
      return {}
    default:
      return state;
  }
}

type PropType = {
  abi: Abi;
  setCallMessage: React.Dispatch<React.SetStateAction<Uint8Array | null>>;
}

const CallContractDropdown = ({abi,setCallMessage}: PropType) =>  {

  const [index,setIndex] = useState(0);
  const [params,setParams] = useReducer(paramsReducer, {});

  useEffect(()=>{
    setParams({type:'CLEAR'})
  },[abi,index])

  useEffect(()=>{
    if(!!abi&&!!abi.abi.contract.messages[index]){
      var name = abi.abi.contract.messages[index].name;
    }else{return}
    if(!!abi.messages[name]){
      var func = abi.messages[name];
      if(func.args.length===Object.keys(params).length){
        var array: RawParamValues = [];
        for (var i = 0; i < func.args.length;i++){
          array.push(params[i]);
        }
        setCallMessage(func(...array));
      }
    }
  },[abi,setCallMessage,index,params])

  useEffect(()=>{
    if(!!abi&&!!abi.abi.contract.messages[index]){
      var name = abi.abi.contract.messages[index].name;
    }else{return}
    if(!!abi.messages&&!!abi.messages[name]){
      var encodeFunc = abi.messages[name];
      var len = Object.keys(params).length;
      if(encodeFunc.args.length===len){
        var array:Array<RawParamValue> = [];
        for (var i = 0; i < len;i++){
          array.push(params[i]);
        }
        setCallMessage(encodeFunc(...array));
      }
    }
  },[params,abi,setCallMessage,index])

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
               {!(_message)?'':`${_message.name}(${_message.args.map((arg,index)=>(arg.name+':'+arg.type.displayName+', '))})`}
              </MenuItem>
					))}

				</Select>
			</FormControl>
      {index!==null?
        abi.abi.contract.messages[index].args.map((arg,argsIndex)=>
        <div className="ui--Params-Content" key={argsIndex}>
          <div className="ui--Param-composite">
            <Param
              name={arg.name}
              onChange={(e:RawParamOnChangeValue)=>{setParams({type:'SET',index:argsIndex,payload:e.value})}}
              onEnter={()=>{}}
              type={arg.type}
              defaultValue={getInitValue(arg.type)}
            />
          </div>
        </div>
      ):[]}
		</div>
  );
}

export default CallContractDropdown;
