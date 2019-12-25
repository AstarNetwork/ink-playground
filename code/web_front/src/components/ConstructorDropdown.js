import React, { useState, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types'
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Param from '@polkadot/react-params/Param';
import getInitValue from '@polkadot/react-params/initValue';
import '@polkadot/react-params/Params.css'
import 'semantic-ui-css/semantic.min.css'
import GlobalStyle from '@polkadot/react-components/styles'

const paramsReducer = (state,action) => {
  switch(action.type){
    case 'SET':
      return {...state,[action.index]:action.payload}
    case 'CLEAR':
      return {}
    default:
      return state
  }
}

const ConstructorDropdown = ({abi,setConstructorMessage}) =>  {

  const [constructorIndex,setConstructorIndex] = useState(0);
  const [params,setParams] = useReducer(paramsReducer,{});

  useEffect(()=>{
    setParams({type:'CLEAR'})
    if(constructorIndex!==null&&abi.abi.contract.constructors[constructorIndex].args.length>0){
      abi.abi.contract.constructors[constructorIndex].args.map((arg,argsIndex)=>{
        return setParams({type:'SET',index:argsIndex, payload:getInitValue(arg.type)})
      })
    }
  },[abi,constructorIndex])

  useEffect(()=>{
    if(!!abi&&!!abi.constructors&&!!abi.constructors[constructorIndex]&&abi.constructors[constructorIndex].args.length===Object.keys(params).length){
      setConstructorMessage(abi.constructors[constructorIndex](...Object.values(params)))
    }
  },[params,abi,setConstructorMessage,constructorIndex])

  return (
		<div>
      <GlobalStyle />
			<FormControl variant="filled" style={{width:"100%",marginBottom:"10px",marginLeft:"20px"}}>
				<InputLabel>{"constructor"}</InputLabel>
				<Select
					value={constructorIndex}
					onChange={(e)=>{setConstructorIndex(e.target.value)}}
				>
					{abi.abi.contract.constructors.map((_constructor, index) => (
							<MenuItem key={index} value={index}>
               {!(_constructor)?'':`${_constructor.name}(${_constructor.args.map((arg,index)=>(arg.name+':'+arg.type.displayName+', '))})`}
              </MenuItem>
					))}

				</Select>
			</FormControl>
      {constructorIndex!==null?
        abi.abi.contract.constructors[constructorIndex].args.map((arg,argsIndex)=>
        <div className="ui--Params-Content" key={argsIndex}>
          <div className="ui--Param-composite">
            <Param
              name={arg.name}
              onChange={(e)=>{setParams({type:'ADD',index:argsIndex,payload:true})}}
              onEnter={()=>{}}
              defaultValue={true}
              type={arg.type}
            />
          </div>
        </div>
      ):[]}
		</div>
  );
}

ConstructorDropdown.propTypes = {
  abi: PropTypes.object.isRequired,
  setConstructorMessage: PropTypes.func.isRequired,
}

export default ConstructorDropdown;
