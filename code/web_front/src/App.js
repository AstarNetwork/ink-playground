import React, {useRef,useState,useEffect} from 'react';
import {Grid,Button} from '@material-ui/core';
import axios from 'axios';
import { ApiPromise, WsProvider } from '@polkadot/api'; 
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import keyring from '@polkadot/ui-keyring';

import Editor from './Editor';
import ResultArea from './ResultArea';
import Loader from './Loader';
import DownloadButton from './DownloadButton';
import Chains from './Chains';
import './App.css';
import codeTemplate from './CodeTemplate';

const WEBSOCKET_URL = (process.env.REACT_APP_TLS=='TRUE'?'wss://':'ws://') + process.env.REACT_APP_PUBLIC_DNS + '/api/compile/';

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
	const [accountLoaded, setaccountLoaded] = useState(false);
	const [substrateHeaderNumber, setSubstrateHeaderNumber] = useState();
	const [chain,setChain] = useState(Chains.plasm_testnet);

	const codeRef = useRef(null);
	const resultRef = useRef(null);

  useEffect(()=>{
    const provider = new WsProvider(chain.ws_provider);
		const types = chain.types;
    ApiPromise.create({provider,types})
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
  },[chain]);

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

	useEffect(() => {
  web3Enable('ink-playground')
  .then((extensions) => {
  web3Accounts()
      .then((accounts) => {
          return accounts.map(({ address, meta }) => ({
              address,
              meta: {
              ...meta,
              name: `${meta.name} (${meta.source})`
              }
          }));
      })
      .then((injectedAccounts) => {
          loadAccounts(injectedAccounts);
      })
      .catch(console.error);
  })
  .catch(console.error);
  }, []);

	const loadAccounts = (injectedAccounts) => {
	keyring.loadAll({
  	  isDevelopment: true
	}, injectedAccounts);
	setaccountLoaded(true);
	};

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
						<DownloadButton label={"metadata"} name={"metadata.json"} mimeType={"application/json"} data={metadata} />
				</div>
			</div>
			</div>
    </div>
  );
}

export default App;
