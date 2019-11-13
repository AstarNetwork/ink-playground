import React, {useRef,useState,useEffect} from 'react';
import {Grid,Button} from '@material-ui/core';
import axios from 'axios';
import { ApiPromise, WsProvider } from '@polkadot/api'; 

import Editor from './Editor';
import ResultArea from './ResultArea';
import Loader from './Loader';
import DownloadButton from './DownloadButton';
import './App.css';
import codeTemplate from './CodeTemplate';

const WS_PROVIDER = 'ws://localhost:9944';
const WEBSOCKET_URL = 'ws://' + process.env.REACT_APP_PUBLIC_DNS + '/api/compile/';

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
	const [abi, setAbi] = useState(null);
	const [result, setResult] = useState('');
	const [showResult, setShowResult ] = useState(false);
	const [loadFlag, setLoadFlag] = useState(false);
	const [api,setApi] = useState();
	const [apiReady,setApiReady] = useState();
	const [substrateHeaderNumber, setSubstrateHeaderNumber] = useState();
	const codeRef = useRef(null);
	const resultRef = useRef(null);

  useEffect(()=>{
    const provider = new WsProvider(WS_PROVIDER);
    ApiPromise.create(provider)
    .then((api)=>{
      setApi(api);
      api.isReady.then(() => {
        setApiReady(true);
        api.rpc.chain.subscribeNewHeads((header)=>{
          setSubstrateHeaderNumber(header.number);
        });
      });
    })
    .catch((e)=>{/*console.error(e)*/;});
  },[]);

	const onCodeSubmit = () => {
		if(loadFlag)
			return ()=>{};
		setLoadFlag(true);
		setAbi(null);
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
      if(data.hasOwnProperty('abi')){
        setAbi(data.abi);
//			result_ += "[abi.json]\n"
//			result_ += data.abi;
      }
      setResult(result_);
      setLoadFlag(false);
			ws.close();
		}
		ws.onclose = () => {
			console.log("conection closed");
			setLoadFlag(false);
		}
		ws.onopen = function() {
			console.log("open");
			ws.send(JSON.stringify({'code':codeRef.current.getValue()}));
		}
  }

  return (
    <div className="App">
      <div className="App-header">
          <div style={{float:"left"}}>
            <h1 style={{margin:'5px', display:'inline'}}>ink! playground</h1>
					</div>
					<div style={{float:"right"}}>
							Substrate Node :
							{apiReady? (" #"+(substrateHeaderNumber) ) : " not connected"}
					</div>
			</div>
			<div style={{flex:'1',display:'flex',flexDirection:'row'}}>
			<div style={{flex:'1',display:'flex',flexDirection:'column',margin:"10px"}}>
        <Button onClick={onCodeSubmit} variant="contained" color="primary" style={{width:"100%"}} >
          Compile Code
        </Button>
				<div style={{flex:'1',display:'flex'}}>
					<div style={{flex:'1',position: 'relative',marginTop:'10px',marginBottom:'10px',border:'2px solid #333', borderRadius:'2px'}}>
						<Editor value={codeTemplate} ref={codeRef} theme="monokai" style={{width:"100%",height:"100%",marginBottom:"40px",marginTop:"20px"}} />
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
						<DownloadButton label={"abi"} name={"abi.json"} mimeType={"application/json"} data={abi} />
				</div>
			</div>
			</div>
    </div>
  );
}

export default App;
