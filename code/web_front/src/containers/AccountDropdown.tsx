import React from 'react';
import { useSelector } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { KeyringPair } from '@polkadot/keyring/types';
import CopyToClipboard from 'react-copy-to-clipboard';
import { RootStore } from './Root';

type PropType = {
	account: KeyringPair|null;
	setAccount: React.Dispatch<React.SetStateAction<KeyringPair|null> >
	 | ((x:KeyringPair) => {type: "SELECT_ACCOUNT";payload: KeyringPair;})
	 | ((x:KeyringPair) => any);
}

const AccountDropdown = ( {account, setAccount} :PropType) =>  {
	const accounts = useSelector((state: RootStore) =>  state.account.items)
	const accountsLoaded = useSelector((state: RootStore) => state.account.accountsLoaded)

  return (
		<div style={{display:"flex"}}>
			<FormControl variant="filled" style={{width:"100%",marginBottom:"10px"}}>
				<InputLabel>Account</InputLabel>
				<Select
					value={!!account?account:""}
					onChange={(e: any)=>{setAccount(e.target.value)}}
				>
					{(accountsLoaded)?accounts.map((account, index) => {
						return (
							<MenuItem key={index} value={account as any} >
								<div style={{width:"100%",display:"flex"}}>
									<div
										style={{flex:2,paddingRight:"5px",overflow:"hidden",textOverflow:"ellipsis"}}
									>
										{account.meta.name}
									</div>
									<div style={{flex:5,overflow:"hidden",textOverflow:"ellipsis"}}>
										{account.address}
									</div>
								</div>
							</MenuItem>
						)
					}):[]}
				</Select>
			</FormControl>
			<CopyToClipboard text={!!account?account.address:""}>
				<IconButton size="medium">
					<Icon style={{margin:0,padding:0}} >note_add</Icon>
				</IconButton>
			</CopyToClipboard>
		</div>
  );
}

export default AccountDropdown;
