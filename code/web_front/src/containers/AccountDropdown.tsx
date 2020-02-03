import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { KeyringPair } from '@polkadot/keyring/types';
import { selectAccount } from '../actions';
import { RootStore } from './Root';

const sliceText = (text) => (text.length > 15 ? (text).slice(0,15)+"…" : text);


const AccountDropdown = () =>  {
	const dispatch = useDispatch()

	const account = useSelector((state: RootStore) => state.account.selectedAccount)
	const accounts = useSelector((state: RootStore) =>  state.account.items)
	const accountsLoaded = useSelector((state: RootStore) => state.account.accountsLoaded)

	const setAccount = (x: KeyringPair) => dispatch(selectAccount(x));


  return (
		<div>
			<FormControl variant="filled" style={{width:"100%",marginBottom:"10px"}}>
				<InputLabel>Account</InputLabel>
				<Select
					value={!!account?account:""}
					onChange={(e: any)=>{setAccount(e.target.value)}}
				>
					{(accountsLoaded)?accounts.map((account, index) => {
						return (
							<MenuItem key={index} value={account as any} > {account.meta.name+' : '+sliceText(account.address)}</MenuItem>
						)
					}):[]}
				</Select>
			</FormControl>

		</div>
  );
}

export default AccountDropdown;
