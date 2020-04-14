import React from 'react';
import { useSelector } from 'react-redux';
import Param from '@polkadot/react-params/Param';
import { RawParamOnChangeValue,RawParamValue } from '@polkadot/react-params/types';
import getInitValue from '@polkadot/react-params/initValue';
import '@polkadot/react-params'
import { ContractABIArgBase } from "@polkadot/api-contract/types"
import { KeyringPair } from '@polkadot/keyring/types';
import AccountDropdown from './AccountDropdown';
import { RootStore } from './Root';
import { u8aToHex } from '@polkadot/util';

type ActionType = {
    index: number;
    payload: RawParamValue;
    type: 'SET';
} | {
    type: 'CLEAR';
}
  
export const paramsReducer = (state:{[index:number]:RawParamValue},action: ActionType) => {
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
    args: ContractABIArgBase[] | null;
    params: {[index:number]:RawParamValue};
    setParams: React.Dispatch<ActionType>;
}

const InputParams = ({args, setParams, params}: PropType) => {
    const accounts = useSelector((state: RootStore) => state.account.items);

    const searchFromAccountId = (accounts:KeyringPair[],address:Uint8Array | string)=>{
        for(var i = 0; i < accounts.length; i++){
            if(accounts[i].publicKey===address || u8aToHex(accounts[i].publicKey)===address){
                return accounts[i];
            }
        }
        return null;
    }

    return(<div>
        {!!args?
        args.map((arg,argsIndex)=>
        <div className="ui--Params-Content" key={argsIndex}>
          <div className="ui--Param-composite">
            {arg.type.name!=='AccountId'
            ?<Param
              name={arg.name}
              onChange={(e:RawParamOnChangeValue)=>{setParams({type:'SET',index:argsIndex,payload:e.value})}}
              onEnter={()=>{}}
              type={arg.type}
              defaultValue={getInitValue(arg.type)}
            />
            :<div style={{paddingLeft: "2rem"}}><AccountDropdown
              account = {!!params[argsIndex]?searchFromAccountId(accounts,params[argsIndex]):null}
              setAccount = {(a:KeyringPair)=>{setParams({type:'SET',index:argsIndex,payload:u8aToHex(a.publicKey)})}}
            /></div>
            }
          </div>
        </div>
      ):[]}
    </div>)
}

export default InputParams;