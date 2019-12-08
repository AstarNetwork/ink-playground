import React, { useRef, useState } from 'react';
import { Button } from '@material-ui/core';

import AppHeader from './AppHeader';
import Editor from './Editor';
import ResultArea from './ResultArea';
import Loader from './Loader';
import DownloadButton from './DownloadButton';
import TxButton from './TxButton';
import '../App.css';
import codeTemplate from '../CodeTemplate';

export const WEBSOCKET_URL = (process.env.REACT_APP_TLS==='TRUE'?'wss://':'ws://') + process.env.REACT_APP_PUBLIC_DNS + '/api/compile/';

const base64ToBuffer = (base64)=>{
	var bin = atob(base64.replace(/^.*,/, ''));
  var buffer = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) {
    buffer[i] = bin.charCodeAt(i);
  }
	return buffer;
}

const App = () => {
	const [wasm,setWasm] = useState(null);
	const [metadata, setMetadata] = useState(null);
	const [result, setResult] = useState('');
	const [showResult, setShowResult ] = useState(false);
	const [loadFlag, setLoadFlag] = useState(false);

	const codeRef = useRef(null);
	const resultRef = useRef(null);

	const onCodeSubmit = () => {
		if(loadFlag)
			return ()=>{};
		setLoadFlag(true);
		setMetadata(null);
		setWasm(null);
		setResult('');
		setShowResult(true);
		var result_="";
		var ws = new WebSocket(WEBSOCKET_URL);
		ws.onmessage = (e) => {
			console.log("get message");
			var data = JSON.parse(e.data);
			if(data.hasOwnProperty('wasm')){
        setWasm(base64ToBuffer(data.wasm));
      }
			if(data.hasOwnProperty('log')){
        result_ += data.log;
        result_ += "\n"
      }
      if(data.hasOwnProperty('metadata')){
        setMetadata(data.metadata);
      }
      setResult(result_);
			ws.close();
		}
		ws.onclose = () => {setLoadFlag(false);}
		ws.onerror = () => {
			setLoadFlag(false);
			setResult("Connection Error");
		}
		ws.onopen = function() {ws.send(JSON.stringify({'code':codeRef.current.getValue()}));}
  }

  return (
    <div className="App">
		  <AppHeader/>
			<div style={{flex:'1',display:'flex',flexDirection:'row'}}>
			<div style={{flex:'1',display:'flex',flexDirection:'column',margin:"10px"}}>
      	<Button onClick={onCodeSubmit} variant="contained" color="primary" style={{width:"100%"}} >
          Compile Code
        </Button>
				<div style={{flex:'1',display:'flex'}}>
					<div style={{flex:'1',position: 'relative',marginTop:'10px',marginBottom:'10px',border:'2px solid #333', borderRadius:'2px'}}>
						<Editor  value={codeTemplate} ref={codeRef} theme="monokai" style={{width:"100%",height:"100%",marginBottom:"40px",marginTop:"20px"}} />
        	</div>
				</div>
				<div style={{display:showResult?'flex':'none',height : '170px',overflow:'scroll'}}>
					<ResultArea value={result} ref={resultRef} theme="monokai"/>
        </div>
      </div>
			<div style={{ overflow:'scroll',borderLeft:"3px solid #444",width:'300px',padding:'10px'}}>
				<Loader flag={loadFlag}/>
				<div style={{marginBottom:"10px"}}>
					<DownloadButton label={"wasm"} name={"sample.wasm"} mimeType={"application/wasm"} data={wasm}/>
        </div>
				<div>
					<DownloadButton label={"metadata"} name={"metadata.json"} mimeType={"application/json"} data={metadata} />
				</div>
				<hr/>
				<div>
					<TxButton label={"put code"} tx={'contracts.putCode'} params={[500000,wasm]} display={wasm != null && metadata != null} />
				</div>
			</div>
			</div>
    </div>
  );
}

export default App;
