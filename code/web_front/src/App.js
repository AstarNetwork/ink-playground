import React, {useRef,useState} from 'react';
import {Grid,Button} from '@material-ui/core';
import axios from 'axios';
import Editor from './Editor';
import ResultArea from './ResultArea';
import Loader from './Loader';
import DownloadButton from './DownloadButton';
import './App.css';
import codeTemplate from './CodeTemplate';

const api_url = 'http://' + process.env.REACT_APP_PUBLIC_DNS + '/api/compile/';

const axiosPost = axios.create({
	xsrfHeaderName: 'X-CSRF-Token',
	withCredentials: true,
})

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
	const [loadFlag, setLoadFlag] = useState(false);
	const codeRef = useRef(null);
	const resultRef = useRef(null);

	const onCodeSubmit = () => {
		setLoadFlag(true);
		setAbi(null);
		setWasm(null);
		setResult('');

		axiosPost.post(api_url,
			{'code':codeRef.current.getValue()})
    .then(response => response.data)
		.then(data => {
			var result_ = "";
			console.log(data);
			if(data.hasOwnProperty('wasm')){ setWasm(base64ToBuffer(data.wasm)); }
			if(data.hasOwnProperty('log')){
				result_ += data.log;
				result_ += "\n"
			}
			if(data.hasOwnProperty('abi')){
				setAbi(data.abi);
				result_ += "[abi.json]\n"
				result_ +=data.abi;
			}
			console.log(result_);
			setResult(result_);
			setLoadFlag(false);
    })
		.catch(err=>{
			setLoadFlag(false);
			console.log(err.response);
		});
  }

  return (
    <div className="App">
      <div className="App-header">
          <div style={{textAlign:"center"}}>
            <h1 style={{margin:'5px'}}  >ink! playground</h1>
          </div>
      </div>
      <Grid container style={{height:'100%'}} >
        <Grid item xs={6} style={{padding:"10px"}}>
          <Button onClick={onCodeSubmit} variant="contained" color="primary" style={{width:"100%",marginTop:"10px",marginBottom:"10px"}} >
            Compile Code
          </Button>
					<div style={{display:'flex',height:'100%'}}>
						<Editor value={codeTemplate} ref={codeRef} theme="monokai" style={{width:"100%",height:"100%",marginBottom:"40px",marginTop:"20px"}} />
        	</div>
				</Grid>
        <Grid item xs={6} style={{padding: '10px'}} >
				<Grid container>
          <Grid item xs={12}>
            <Loader flag={loadFlag}/>
					</Grid>
					<Grid item xs={6} style={{padding: '10px'}}>
            <DownloadButton label={"wasm"} name={"sample.wasm"} mimeType={"application/wasm"} data={wasm}/>
          </Grid>
          <Grid item xs={6} style={{padding: '10px'}}>
            <DownloadButton label={"abi"} name={"abi.json"} mimeType={"application/json"} data={abi} />
          </Grid>
				</Grid>
					<div style={{display:'flex',height : '100%'}}>
						<ResultArea value={result} ref={resultRef} theme="monokai"/>
        	</div>
				</Grid>
      </Grid>
    </div>
  );
}

export default App;
