import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { selectAccount } from '../actions';
import Modal, { ModalTemplateHandler } from '../components/ModalTemplate'
import About from '../components/About'
import GitHubIcon from '../images/GitHub.png'
import CustomChainSetting from './CustomChainSetting'
import { RootStore } from './Root'

const sliceText = (text :string) => (text.length > 15 ? (text).slice(0,15)+"…" : text);


const AppHeader = () =>  {
	const dispatch = useDispatch<any>()

	const account = useSelector((state: RootStore) => state.account.selectedAccount)
	const accounts = useSelector((state: RootStore) =>  state.account.items)
	const accountsLoaded = useSelector((state: RootStore) => state.account.accountsLoaded)
	const chain = useSelector((state: RootStore) => state.chain.selectedChain)
	const chainApiDisconnected = useSelector((state: RootStore) => state.chain.chainApiDisconnected)
	const customModalRef = useRef({} as ModalTemplateHandler)
	const aboutModalRef = useRef({} as ModalTemplateHandler)

	const setAccount = (x) => dispatch(selectAccount(x));

	const [anchorElAccount, setAnchorElAccount] = useState(null);

	const handleClick = (setAnchorEl) => (event => {setAnchorEl(event.currentTarget);});
	const handleClose = (setAnchorEl,setVal,newVal) => (()=>{setVal(newVal);setAnchorEl(null);});

	const handleModal = () => {customModalRef.current.handleOpen()};

  return (
		<div className="App-header">
		<div style={{flex: "1", "textAlign":"left"}}>
			<h1 style={{margin:'5px', display:'inline'}}>ink! playground</h1>
		</div>
		<Button aria-haspopup="true" onClick={handleModal} style={{color:"#FFF"}}>
			{chain !== null && !chainApiDisconnected ? chain.name : "select chain"}
		</Button>

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
				<MenuItem key={index} onClick={handleClose(setAnchorElAccount,setAccount,account)} > {account.meta.name+' : '+sliceText(account.address)}</MenuItem>
			)
		}):[]}
		</Menu>
		<Button aria-haspopup="true" onClick={()=>aboutModalRef.current.handleOpen()} style={{color:"#FFF"}} >
			About
		</Button>
		<div style={{float:"right",width:"40px"}}>
			<a href="https://github.com/staketechnologies/ink-playground" rel="noopener noreferrer" target="_blank" ><img src={GitHubIcon} height={"30px"} alt="github" /></a>
		</div>

		<Modal ref={customModalRef}>
			<CustomChainSetting handleClose={()=>customModalRef.current.handleClose()} />
		</Modal>
		<Modal ref={aboutModalRef}>
			<About handleClose={()=>aboutModalRef.current.handleClose()} />
		</Modal>
		</div>
  );
}

export default AppHeader;
