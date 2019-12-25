import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

import { selectAccount } from '../actions';

const sliceText = (text) => (text.length > 15 ? (text).slice(0,15)+"…" : text);


const AccountDropdown = () =>  {
	const dispatch = useDispatch()

	const account = useSelector(state => state.account.selectedAccount)
	const accounts = useSelector(state =>  state.account.items)
	const accountsLoaded = useSelector(state => state.account.accountsLoaded)

	const setAccount = (x) => dispatch(selectAccount(x));


  return (
		<div>
			<FormControl variant="filled" style={{width:"100%",marginBottom:"10px"}}>
				<InputLabel>Account</InputLabel>
				<Select
					value={!!account?account:""}
					onChange={(e)=>{setAccount(e.target.value)}}
				>
					{(accountsLoaded)?accounts.map((account, index) => {
						return (
							<MenuItem key={index} value={account} > {account.meta.name+' : '+sliceText(account.address)}</MenuItem>
						)
					}):[]}
				</Select>
			</FormControl>

		</div>
  );
}

export default AccountDropdown;
