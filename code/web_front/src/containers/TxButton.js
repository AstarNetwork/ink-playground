import React from 'react';
import { connect } from 'react-redux';
import {Button} from '@material-ui/core'
import PropTypes from 'prop-types'
import { web3FromSource } from '@polkadot/extension-dapp';
import PublishRoundedIcon from '@material-ui/icons/PublishRounded';

var TxButton = ({label,display,account,chainApi,chainApiIsReady,tx,params}) => {

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
				console.log('fromParam:',fromParam);

				chainApi.tx[section][method](...params)
				.signAndSend(fromParam,({ status }) => {
        	if (status.isFinalized) {
						console.log(status.asFinalized.toString);
        	} else {
						console.log(status.type);
        	}
    		}).catch((e) => {
        	console.log('ERROR:', e);
    		});
			}
		}
		return main();
	}

	return (
	<Button variant="contained" color="primary" onClick={onClick} style = {{display:(chainApiIsReady&&display?'':'none')}}>
		<PublishRoundedIcon style={{marginRight: 8}} />
    {label}
	</Button>
	);
}

TxButton.propTypes = {
	label: PropTypes.string,
	display: PropTypes.bool,
	account: PropTypes.object,
	chainApi: PropTypes.object,
	chainApiIsReady: PropTypes.bool.isRequired,
}

const mapStateToProps = (state,ownProps) => ({
	...ownProps,
	account: state.account.selectedAccount,
	chainApi: state.chain.chainApi,
	chainApiIsReady: state.chain.chainApiIsReady,
})

export default connect(mapStateToProps)(TxButton);
