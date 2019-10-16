import React,{useState,useEffect} from 'react';
import {Button} from '@material-ui/core'
import Icon from '@material-ui/core/Icon'

const DownloadAbi = (props) => {
	const [css,setCss] = useState();
	const onDownload=()=>{
		const abi = props.abi;
		var link = document.createElement('a');
		link.download = 'old_abi.json';
		link.href = URL.createObjectURL(new Blob([abi],{type:'appication/json'}));
		link.click();
	}
	
	useEffect(()=>{
		var css={};
		css = {width:'100%'};
		css.display=(props.abi!==null?'':'none');
		setCss(css);
	},[props.abi]);
	
	return (
	<Button onClick={onDownload} style={css} variant="contained" color="secondary" >
		<Icon style={{marginRight: 8 }} >save_alt_rounded</Icon>
    abi
	</Button>
	);
}

export default DownloadAbi;
