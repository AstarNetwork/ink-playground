import React,{useState,useEffect} from 'react';
import {Button} from '@material-ui/core'
import Icon from '@material-ui/core/Icon'

const DownloadButton = (props) => {
	const [css,setCss] = useState();
	const onDownload = () => {
		const mimeType = props.mimeType;
		const name = props.name;
		const data = props.data;

		var bom  = new Uint8Array([0xEF, 0xBB, 0xBF]);
		var blob = new Blob([bom, data],{type : mimeType});	
		var a = document.createElement('a');
		a.download = name;
		a.target = '_blank';

		if (window.navigator.msSaveBlob) {
			// for IE
			window.navigator.msSaveBlob(blob, name)
		} else if (window.URL && window.URL.createObjectURL) {
			// for Firefox
			a.href = window.URL.createObjectURL(blob);
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		} else if (window.webkitURL && window.webkitURL.createObject) {
			// for Chrome
			a.href = window.webkitURL.createObjectURL(blob);
			a.click();
		} else {
			// for Safari
			window.open('data:' + mimeType + ';base64,' + window.Base64.encode(data), '_blank');
		}
	}
	
	useEffect(()=>{
		var css={};
		css = {width:'100%'};
		css.display=(props.data!==null?'':'none');
		setCss(css);
	},[props.data]);
	
	return (
	<Button onClick={onDownload} style={css} variant="contained" color="secondary" >
		<Icon style={{marginRight: 8}} >save_alt_rounded</Icon>
    {props.label}
	</Button>
	);
}

export default DownloadButton;
