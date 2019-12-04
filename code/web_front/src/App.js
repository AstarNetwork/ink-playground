import React, {useRef,useState,useEffect,createContext} from 'react';
import {Grid,Button} from '@material-ui/core';
import { ApiPromise, WsProvider } from '@polkadot/api';
import keyring from '@polkadot/ui-keyring';

import AppHeader from './AppHeader';
import Editor from './Editor';
import ResultArea from './ResultArea';
import Loader from './Loader';
import DownloadButton from './DownloadButton';
import Chains from './Chains';
import './App.css';
import {ChainContext} from './Contexts';
import codeTemplate from './CodeTemplate';

export const WEBSOCKET_URL = (process.env.REACT_APP_TLS=='TRUE'?'wss://':'ws://') + process.env.REACT_APP_PUBLIC_DNS + '/api/compile/';

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
	const [api,setApi] = useState();
	const [apiReady,setApiReady] = useState();
	const [substrateHeaderNumber, setSubstrateHeaderNumber] = useState();
	const [chain,setChain] = useState(Chains.flaming_fir);

	const codeRef = useRef(null);
	const resultRef = useRef(null);

  useEffect(()=>{
		console.log("called effect");
		const effect = async ()=>{
	    const provider = new WsProvider(chain.ws_provider);
			const types = chain.types;
			const api = await ApiPromise.create({provider,types});
	    setApi(api);
			api.once('disconnected', (): void => {
				console.log('mmmmm disconnected');
			});
			api.once('error', (): void => {
				console.log('mmmmm error');
			});
					    if(api.isReady){
	        setApiReady(true);
	        const unsub = await api.rpc.chain.subscribeNewHeads((header)=>{
	          setSubstrateHeaderNumber(header.number);
	        }).catch((e)=>{/*console.error(e)*/;});
					return (
						()=>{
							setApiReady(false);
							unsub();
						}
					);
	    }
		}
		effect();
  },[chain.name]);

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
//			result_ += "[metadata.json]\n"
//			result_ += data.metadata;
      }
      setResult(result_);
			ws.close();
		}
		ws.onclose = () => {
			setLoadFlag(false);
		}
		ws.onerror = () => {
			setLoadFlag(false);
			setResult("Connection Error");
		}
		ws.onopen = function() {
			ws.send(JSON.stringify({'code':codeRef.current.getValue()}));
		}
  }

  return (
    <div className="App">
			 <ChainContext.Provider value={[chain,setChain]}>
       <AppHeader props={{apiReady,substrateHeaderNumber}}/>
			 </ChainContext.Provider>

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
			</div>
			</div>
    </div>
  );
}

export default App;
