import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {Button} from '@material-ui/core'
import PropTypes from 'prop-types'
import { web3FromSource } from '@polkadot/extension-dapp';
import PublishRoundedIcon from '@material-ui/icons/PublishRounded';
import { addConsoleLine } from '../actions'

var TxButton = ({label,tx,params,onSend,style}) => {
	const dispatch = useDispatch();
	const setResult = (x) => dispatch(addConsoleLine(x))

	const account = useSelector(state => state.account.selectedAccount);
	const chainApi = useSelector(state => state.chain.chainApi);
	const chainApiIsReady = useSelector(state => state.chain.chainApiIsReady);

	const onClick = () => {

		console.log('clicked: ',tx);
		const [section, method] = tx.split('.');

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

				if(!(chainApi.tx[section] && chainApi.tx[section][method])){setResult(`Unable to find api.tx.${section}.${method}`);}

				const nonce = await chainApi.query.system.accountNonce(account.address);

				chainApi.tx[section][method](...params)
				.signAndSend(fromParam, { nonce }, onSend ).catch((e) => {
        	setResult(e.toString());
    		});
			}
		}
		return main();
	}

	return (
	<Button variant="contained" color="primary" onClick={onClick} style = {{...style,width:"100%"}}>
		<PublishRoundedIcon style={{marginRight: 8}} />
    {label}
	</Button>
	);
}

TxButton.propTypes = {
	label: PropTypes.string,
	display: PropTypes.bool,
	tx: PropTypes.string.isRequired,
	params: PropTypes.array.isRequired,
	onSend: PropTypes.func.isRequired,
}

export default TxButton;
