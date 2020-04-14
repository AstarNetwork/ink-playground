import React, { useState, useReducer, useEffect } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Param from '@polkadot/react-params/Param';
import getInitValue from '@polkadot/react-params/initValue';
import '@polkadot/react-params'
import 'semantic-ui-css/semantic.min.css'
import GlobalStyle from '@polkadot/react-components/styles'
import { RawParamValue, RawParamOnChangeValue } from '@polkadot/react-params/types';
import { Abi } from '@polkadot/api-contract';
import { ActionType as ReturnTypeActionType } from '../containers/LocalWasmTesterModalButton';


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
  setConstructorMessage: React.Dispatch<React.SetStateAction<Uint8Array | null> >;
  setDisplay?: React.Dispatch<React.SetStateAction<string>>;
  setReturnType?: React.Dispatch<ReturnTypeActionType>;
}

const ConstructorDropdown = ({abi,setConstructorMessage,setDisplay, setReturnType}: PropType) =>  {

  const [index,setIndex] = useState(0);
  const [params,setParams] = useReducer(paramsReducer,{});

  useEffect(()=>{
    setParams({type:'CLEAR'});
  },[abi,index])

  useEffect(()=>{
    var len = Object.keys(params).length
    if(!!abi&&abi.constructors.length > index&&abi.constructors[index].args.length===len){
      var array: RawParamValue[] = [];
      for (var i = 0; i < len;i++){
        array.push(params[i]);
      }
      const encodeFunc = abi.constructors[index];
      const _constructorMessage = encodeFunc(...array);
      setConstructorMessage(_constructorMessage)
      if(!!setReturnType){
        setReturnType({type:'deploy', payload: abi.abi.contract.constructors[index].returnType});
      }
      if(!!setDisplay){
        const paramsDisplay = (array.length===0)
          ?`()`
          :`(${array.map((e,i)=>{return `\n  ${abi.constructors[index].args[i].name}: ${e.toString()}`})}\n)`
        setDisplay(`${abi.abi.contract.constructors[index].name}${paramsDisplay}\n`)
      }
    }
  },[params,abi,setConstructorMessage,setReturnType,setDisplay,index])

  return (
		<div>
      <GlobalStyle />
			<FormControl variant="filled" style={{width:"100%",marginBottom:"10px",marginLeft:"20px"}}>
				<InputLabel>{"constructor"}</InputLabel>
				<Select
					value={index}
					onChange={(e:any)=>{setIndex(e.target.value)}}
				>
					{abi.abi.contract.constructors.map((_constructor, index) => (
							<MenuItem key={index} value={index}>
               {!(_constructor)?'':`${_constructor.name}(${_constructor.args.map((arg,index)=>(arg.name+':'+arg.type.displayName+', '))})`}
              </MenuItem>
					))}

				</Select>
			</FormControl>
      {index!==null?
        abi.abi.contract.constructors[index].args.map((arg,argsIndex)=>
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

export default ConstructorDropdown;
