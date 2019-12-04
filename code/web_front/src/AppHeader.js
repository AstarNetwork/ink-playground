import React, {useState,useEffect,useContext} from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import keyring from '@polkadot/ui-keyring';

import {ChainContext,AllAccountsContext,AccountContext,AccountLoadedContext} from './Contexts'
import Chains from './Chains'
import GitHubIcon from './images/GitHub.png'

export default function AppHeader(props) {
	const [anchorElChain, setAnchorElChain] = useState(null);
	const [anchorElAccount, setAnchorElAccount] = useState(null);
	const [accounts,setAccounts] = useState(null);
	const [account,setAccount] = useState(null);
	const [accountLoaded, setAccountLoaded] = useState(null);
	const [chain,setChain] = useContext(ChainContext);

	const handleClick = (setAnchorEl) => (event => {setAnchorEl(event.currentTarget);});
	const handleClose = (setAnchorEl,setVal,newVal) => (()=>{setVal(newVal);setAnchorEl(null);});

	const loadAccounts = (injectedAccounts) => {
		keyring.loadAll({
			isDevelopment: true
		}, injectedAccounts);
		setAccounts(keyring.getPairs());
		setAccountLoaded(true);
	};

	useEffect(() => {
		web3Enable('ink-playground')
		.then((extensions) => {
			web3Accounts()
			.then((accounts) => {
				return accounts.map(({ address, meta }) => ({
					address,
					meta: {
						...meta,
						name: `${meta.name} (${meta.source})`
					}
				}));
			})
			.then((injectedAccounts) => {
				loadAccounts(injectedAccounts);
			})
			.catch(console.error);
		})
		.catch(console.error);
	}, []);

  return (
		<div className="App-header">
		<div style={{flex: "1", "textAlign":"left"}}>
			<h1 style={{margin:'5px', display:'inline'}}>ink! playground</h1>
		</div>
		<Button aria-controls="chain-menu" aria-haspopup="true" onClick={handleClick(setAnchorElChain)} style={{color:"#FFF"}}>
			{chain != null ? chain.name : "select chain"}
		</Button>
		<Menu
			id="chain-menu"
			anchorEl={anchorElChain}
			keepMounted
			open={Boolean(anchorElChain)}
			onClose={handleClose(setAnchorElChain,setChain,chain)}
		>
		{Object.values(Chains).map((chain_, index) => {
			return (
				<MenuItem key={index} onClick={handleClose(setAnchorElChain,setChain,chain_)} >{chain_.name}</MenuItem>
    	)
		})}
	</Menu>

		<Button aria-controls="account-menu" aria-haspopup="true" onClick={handleClick(setAnchorElAccount)} style={{color:"#FFF"}}>
			{(account!=null&&account.meta!=null)?account.meta.name:'choose account'}
		</Button>
		<Menu
			id="account-menu"
			anchorEl={anchorElAccount}
			keepMounted
			open={Boolean(anchorElAccount)}
			onClose={handleClose(setAnchorElAccount,setAccount,account)}
		>

		{(accountLoaded)?accounts.map((account, index) => {
			return (
				<MenuItem key={index} onClick={handleClose(setAnchorElAccount,setAccount,account)} >{account.address} : {account.meta.name}</MenuItem>
    	)
		}):[]}
		</Menu>
		<div style={{float:"right",width:"40px"}}>
			<a href="https://github.com/stakedtechnologies/ink-playground" target="_blank" ><img src={GitHubIcon} height={"30px"} /></a>
		</div>
		</div>
  );
}
