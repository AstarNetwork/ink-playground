import React, { useState, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types'
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Param from '@polkadot/react-params/Param';
import getInitValue from '@polkadot/react-params/initValue';
import '@polkadot/react-params/Params.css'
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

const CallContractDropdown = ({abi,setCallMessage}) =>  {

  const [index,setIndex] = useState(0);
  const [params,setParams] = useReducer(paramsReducer,{});

  useEffect(()=>{
    setParams({type:'CLEAR'})
    if(index!==null&&abi.abi.contract.messages[index].args.length>0){
      abi.abi.contract.messages[index].args.map((arg,argsIndex)=>{
        return setParams({type:'SET',index:argsIndex, payload:getInitValue(arg.type)})
      })
    }
  },[abi,index])

  useEffect(()=>{
    if(!!abi&&!!abi.abi&&!!abi.abi.contract&&!!abi.abi.contract.messages&&!!abi.abi.contract.messages[index]){
      var name = abi.abi.contract.messages[index].name;
    }else{return}
    if(!!abi.messages&&!!abi.messages[name]){
      var func = abi.messages[name];
      if(func.args.length===Object.keys(params).length){
        console.log(func,func(...Object.values(params)))
        setCallMessage(func(...Object.values(params)))
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
					onChange={(e)=>{setIndex(e.target.value)}}
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

CallContractDropdown.propTypes = {
  abi: PropTypes.object.isRequired,
  setCallMessage: PropTypes.func.isRequired,
}

export default CallContractDropdown;
