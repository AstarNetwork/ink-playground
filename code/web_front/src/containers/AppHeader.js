import React, { useState } from 'react';
import { useSelector, useDispatch, connect } from 'react-redux';
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { selectAccount, selectChainById, startSelectedChain } from '../actions';

import GitHubIcon from '../images/GitHub.png'

const AppHeader = ({}) =>  {
	const dispatch = useDispatch()

	const account = useSelector(state => state.account.selectedAccount)
	const accounts = useSelector(state =>  state.account.items)
	const accountsLoaded = useSelector(state => state.account.accountsLoaded)
	const chain = useSelector(state => state.chain.items[state.chain.selectedChainId])
	const chains = useSelector(state => state.chain.items)

	const setChain = (x) => {dispatch(selectChainById(x));dispatch(startSelectedChain());}
	const setAccount = (x) => dispatch(selectAccount(x));

	const [anchorElChain, setAnchorElChain] = useState(null);
	const [anchorElAccount, setAnchorElAccount] = useState(null);

	const handleClick = (setAnchorEl) => (event => {setAnchorEl(event.currentTarget);});
	const handleClose = (setAnchorEl,setVal,newVal) => (()=>{setVal(newVal);setAnchorEl(null);});

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
			onClose={()=>{setAnchorElChain(null)}}
		>
		{Object.values(chains).map((chain_, index) => {
			return (
				<MenuItem key={index} onClick={handleClose(setAnchorElChain,setChain,chain_.id)} >{chain_.name}</MenuItem>
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
			onClose={()=>{setAnchorElAccount(null)}}
		>

		{(accountsLoaded)?accounts.map((account, index) => {
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

export default AppHeader;
