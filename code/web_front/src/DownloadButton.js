import React,{useState,useEffect} from 'react';
import {Button} from '@material-ui/core'
import Icon from '@material-ui/core/Icon'

const DownloadButton = (props) => {
	const [css,setCss] = useState();
	const onDownload=()=>{
		const data = props.data;
		var link = document.createElement('a');
		link.download = props.name;
		link.href = URL.createObjectURL(new Blob([data],{type:props.mimeType}));
		link.click();
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
