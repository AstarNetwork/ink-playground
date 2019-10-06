import React from 'react';
import {Button} from '@material-ui/core'
import Icon from '@material-ui/core/Icon'

const DownloadAbi = (props) => {
	const onDownload=()=>{
		const abi = props.abi;
		var link = document.createElement('a');
		link.download = 'old_abi.json';
		link.href = URL.createObjectURL(new Blob([abi],{type:'appication/json'}));
		link.click();
	}
	
	return (
	<Button onClick={onDownload} variant="contained" color="secondary" style={{height:'150px',width:'90%',display:(props.abi!==null?'':'none')}}>
		<Icon style={{marginRight: 8 }} >save_alt_rounded</Icon>
    abi
	</Button>
	);
}

export default DownloadAbi;
