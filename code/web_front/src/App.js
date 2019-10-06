import React, {useRef,useState} from 'react';
import {Grid,Button} from '@material-ui/core';
import axios from 'axios';
import Editor from './Editor';
import Loader from './Loader';
import DownloadWasm from './DownloadWasm';
import DownloadAbi from './DownloadAbi';
import './App.css';
import codeTemplate from './CodeTemplate';

const api_url = 'http://' + process.env.REACT_APP_PUBLIC_DNS + '/api/compile/';

const axiosPost = axios.create({
	xsrfHeaderName: 'X-CSRF-Token',
	withCredentials: true,
})

const App = () => {
	const [wasm,setWasm] = useState(null);
	const [abi, setAbi] = useState(null);
	const [loadFlag, setLoadFlag] = useState(false);
	const codeRef = useRef(null);

	const onCodeSubmit = () => {
		setLoadFlag(true);
		setAbi(null);
		setWasm(null);

		axiosPost.post(api_url,
			{'code':codeRef.current.getValue()})
    .then(data => {
			console.log(codeRef.current.getValue());
			console.log(data);
			if(data.data.hasOwnProperty('wasm')){ setWasm(data.data.wasm); }
			if(data.data.hasOwnProperty('abi')){ setAbi(data.data.abi); }
			setLoadFlag(false);
    })
		.catch(err=>{
			setLoadFlag(false);
			console.log(err.response);
		});
		;
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
					<Editor value={codeTemplate} ref={codeRef} theme="monokai" style={{width:"80%",height:"70%",marginBottom:"40px",marginTop:"20px"}} />
          <Button onClick={onCodeSubmit} variant="contained" color="primary" style={{width:"80%",marginTop:"10px",marginBottom:"10px"}} >
            Compile Code
          </Button>
        </Grid>
        <Grid item xs={6} style={{display:"flex",alignItems:"center",padding:"10px"}}><Grid container>
          <Grid item xs={6}>
            <DownloadWasm wasm={wasm}/>
          </Grid>
          <Grid item xs={6}>
            <DownloadAbi abi={abi}/>
          </Grid>
					<Grid item xs={12}>
						<Loader flag={loadFlag}/>
					</Grid>
        </Grid></Grid>
      </Grid>
    </div>
  );
}

export default App;
