import React, {useState,useEffect} from 'react';
import {Button} from '@material-ui/core';
import Icon from'@material-ui/core/Icon';

function toBlob(base64,mime) {
	var bin = atob(base64.replace(/^.*,/, ''));
	var buffer = new Uint8Array(bin.length);
	for (var i = 0; i < bin.length; i++) {
		buffer[i] = bin.charCodeAt(i);
	}
	//make Blob
	try{
		var blob = new Blob([buffer.buffer], {
			type: mime
		});
	}catch(e){
		return false;
	}
	return blob;
}

const DownloadWasm = (props) => {
	const [css,setCss] = useState();
	const onDownload=()=>{
		const wasm = toBlob(props.wasm,'application/wasm');
		var link = document.createElement('a');
		link.download = 'sample.wasm';
		link.href = URL.createObjectURL(wasm);
		link.click();
	}
	
	useEffect(()=>{
		var css={width:"100%"};
		css.display=(props.wasm!==null? '' : 'none');
		setCss(css);
	},[props.wasm])
	
	return (
	<Button style={css} onClick={onDownload} variant="contained" color="secondary">
    <Icon style={{marginRight: 8 }} >save_alt_rounded</Icon>
    wasm
	</Button>
	);
}

export default DownloadWasm;
