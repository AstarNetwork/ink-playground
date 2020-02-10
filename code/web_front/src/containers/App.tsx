import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import AppHeader from './AppHeader';
import Editor, { EditorHandler } from './Editor';
import ResultArea from './ResultArea';
import Loader from './Loader';
import DownloadButton from '../components/DownloadButton';
import { addConsole } from '../actions'
import '../App.css';
import ChainStatus from './ChainStatus';
import { RootStore } from './Root';
import LocalWasmSelectModalButton from '../components/LocalWasmSelectModalButton';
import LocalWasmTesterModalButton from './LocalWasmTesterModalButton';

const WEBSOCKET_URL = (process.env.REACT_APP_TLS === 'TRUE' ? 'wss://' : 'ws://') + process.env.REACT_APP_PUBLIC_DNS + '/api/compile/';

const base64ToBuffer = (base64: string) => {
	var bin = atob(base64.replace(/^.*,/, ''));
	var buffer = new Uint8Array(bin.length);
	for (var i = 0; i < bin.length; i++) {
		buffer[i] = bin.charCodeAt(i);
	}
	return buffer;
}

const App = () => {
	const [codeTemplate,setCodeTemplate] = useState("");
	useEffect(()=>{
		fetch('sample_lib.rs')
		.then((response)=>response.text())
		.then((text)=>{
			setCodeTemplate(text);
		})
	},[])
	const dispatch = useDispatch();

	const [wasm, setWasm] = useState<Uint8Array | null>(null);
	const [metadata, setMetadata] = useState<string | null>(null);
	const [loadFlag, setLoadFlag] = useState<boolean>(false);

	const api = useSelector((state: RootStore) => state.chain.chainApi);
	const apiIsReady = useSelector((state: RootStore) => state.chain.chainApiIsReady);

	const result = useSelector((state: RootStore) => state.consoleArea.value);
	const setResult = (x: string) => dispatch(addConsole(x));
	const codeRef = useRef({} as EditorHandler);
	const resultRef = useRef(null);

	const onCodeSubmit = () => {
		if (loadFlag)
			return () => { };
		setLoadFlag(true);
		setMetadata(null);
		setWasm(null);
		setResult('');
		var result_ = "";
		var ws = new WebSocket(WEBSOCKET_URL);
		ws.onmessage = (e) => {
			var data = JSON.parse(e.data);
			if (data.hasOwnProperty('wasm')) {
				setWasm(base64ToBuffer(data.wasm));
			}
			if (data.hasOwnProperty('log')) {
				result_ += data.log;
				result_ += "\n"
			}
			if (data.hasOwnProperty('metadata')) {
				setMetadata(data.metadata);
			}
			setResult(result_);
			ws.close();
		}
		ws.onclose = () => { setLoadFlag(false); }
		ws.onerror = () => {
			setLoadFlag(false);
			setResult("Compiler server connection error\n");
		}
		ws.onopen = function () {
			ws.send(JSON.stringify({ 'code': codeRef.current.getValue() }));
		}
	}

	return (
		<div className="App">
			<AppHeader />
			<div style={{ flex: '1', display: 'flex', flexDirection: 'row' }}>
				<div style={{ flex: '2', display: 'flex', flexDirection: 'column', margin: "10px" }}>
					<Button onClick={onCodeSubmit} variant="contained" color="primary" style={{ width: "100%" }} >
						Compile Code
			       	</Button>
					<div style={{ flex: '1', display: 'flex' }}>
						<div style={{ flex: '1', position: 'relative', marginTop: '10px', marginBottom: '10px', border: '2px solid #333', borderRadius: '2px' }}>
							<Editor value={codeTemplate} ref={codeRef} theme="monokai" style={{ width: "100%", height: "100%", marginBottom: "40px", marginTop: "20px" }} />
						</div>
					</div>
				</div>
				<div style={{ overflow: 'scroll', borderLeft: "3px solid #444", width: '250px', padding: '10px' }}>
					<Loader flag={loadFlag} />
					<div style={{ marginBottom: "10px" }}>
						<DownloadButton label={"wasm"} name={"sample.wasm"} mimeType={"application/wasm"} data={wasm} />
					</div>
					<div style={{ marginBottom: "10px" }}>
						<DownloadButton label={"metadata"} name={"metadata.json"} mimeType={"application/json"} data={metadata} />
					</div>
					<div>
						<LocalWasmSelectModalButton label={"select local"} setWasm={setWasm} setMetadata={setMetadata} />
					</div>
					<hr />
					<div>
						{(!!wasm&&!!metadata)
        					?<LocalWasmTesterModalButton label="Test wasm in local" metadata={metadata} wasm={wasm} />
        					:[]
      					}
						<ChainStatus
							api={api}
							apiIsReady={apiIsReady}
							wasm={wasm}
							metadata={metadata}
						/>
					</div>
				</div>
				<div style={{ flex: '1' }}>
					<ResultArea value={result} ref={resultRef} theme="monokai" />
				</div>
			</div>
		</div>
	);
}

export default App;
