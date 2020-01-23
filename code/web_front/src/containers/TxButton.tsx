/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-var-requires */

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@material-ui/core'
import { web3FromSource } from '@polkadot/extension-dapp';
import { addConsoleLine } from '../actions'
import { RootStore } from './Root'

type PropType = {
	label?: string,
	display?: boolean,
	tx: string,
	params: Array<any>,
	style?: any,
	onSend?: Function,
}
var TxButton = ({label,tx,params,onSend,style}: PropType) => {
	const dispatch = useDispatch();
	const setResult = (x) => dispatch(addConsoleLine(x))

	const account = useSelector((state: RootStore) => state.account.selectedAccount);
	const chainApi = useSelector((state: RootStore) => state.chain.chainApi);
	const chainApiIsReady = useSelector((state: RootStore) => state.chain.chainApiIsReady);

	const onClick = () => {

		const [section, method] = tx.split('.');

		const main = async () => {
			if(chainApiIsReady && account != null){
				let fromParam
				if (account && account.meta && account.meta.isInjected) {
			    	const injected = await web3FromSource(account.meta.source);
			    	fromParam = account.address;
			    	chainApi!.setSigner(injected.signer);
					} else {
			    	fromParam = account;
				}

				if(!(chainApi!.tx[section] && chainApi!.tx[section][method])){setResult(`Unable to find api.tx.${section}.${method}`);}

				const nonce = await chainApi!.query.system.accountNonce(account.address);

				
				(chainApi!.tx[section][method](...params) as any)
					.signAndSend(fromParam, { nonce }, onSend ).catch((e) => {
        				setResult(e.toString());
					});
			}
		}
		return main();
	}

	return (
	<Button variant="contained" color="primary" onClick={onClick} style = {{...style,width:"100%"}}>
    	{label}
	</Button>
	);
}

export default TxButton;
