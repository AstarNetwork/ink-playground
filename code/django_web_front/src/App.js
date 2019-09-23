import React, {useRef,useState} from 'react';
import {Grid,Button} from '@material-ui/core'
import axios from 'axios';
import './App.css';

const axiosPost = axios.create({
	xsrfHeaderName: 'X-CSRF-Token',
	withCredentials: true,
})

const App = () => {
  const [wat,setWat] = useState('wat code is written here');
  const inputCode = useRef(null);
  const onCodeSubmit = () => {
    axiosPost.post('http://ec2-18-179-60-53.ap-northeast-1.compute.amazonaws.com:8000/api/compile/',{'code':inputCode.current.value})
    .then(data => {
			console.log(data);
      setWat(data.data.wat);
    });
  }

  return (
    <div className="App">
      <div className="App-header">
          <div style={{textAlign:"center"}}>
            <h1>ink! playground</h1>
          </div>
      </div>
      <Grid container >
        <Grid item xs={6} style={{padding:"10px"}}>
          <textarea ref={inputCode} id="librs" rows="10" style={{width:"80%",marginBottom:"20px",marginTop:"20px"}} placeholder="input your ink! code here"/>
          <Button onClick={onCodeSubmit} variant="contained" color="primary" style={{width:"80%",marginTop:"10px",marginBottom:"10px"}} >
            Compile Code
          </Button>
        </Grid>
        <Grid item xs={6} style={{padding:"10px"}}>
					<pre style={{textAlign:'left'}}>
						{wat}
					</pre>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
