import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {Button} from '@material-ui/core'
import PropTypes from 'prop-types'
import { web3FromSource } from '@polkadot/extension-dapp';
import PublishRoundedIcon from '@material-ui/icons/PublishRounded';

import { addConsole } from '../actions'

var TxButton = ({label,display,tx,params}) => {
	const dispatch = useDispatch();
	const setResult = (x) => dispatch(addConsole(x))

	const account = useSelector(state => state.account.selectedAccount);
	const chainApi = useSelector(state => state.chain.chainApi);
	const chainApiIsReady = useSelector(state => state.chain.chainApiIsReady);

	const [section, method] = tx.split('.');

	const onClick = () => {
		const main = async () => {
			if(chainApiIsReady && account != null){
				let fromParam
				if (account && account.meta && account.meta.isInjected) {
			    	const injected = await web3FromSource(account.meta.source);
			    	fromParam = account.address;
			    	chainApi.setSigner(injected.signer);
					} else {
			    	fromParam = account;
				}

				chainApi.tx[section][method](...params)
				.signAndSend(fromParam,({ status }) => {
        	if (status.isFinalized) {
						console.log(status.asFinalized.toString);
        	} else {
						setResult(status.type);
        	}
    		}).catch((e) => {
        	console.log('ERROR:', e);
    		});
			}
		}
		return main();
	}

	return (
	<Button variant="contained" color="primary" onClick={onClick} style = {{width:"100%",display:(chainApiIsReady&&display?'':'none')}}>
		<PublishRoundedIcon style={{marginRight: 8}} />
    {label}
	</Button>
	);
}

TxButton.propTypes = {
	label: PropTypes.string,
	display: PropTypes.bool,
	tx: PropTypes.string.isRequired,
	params: PropTypes.array,
}

export default TxButton;
