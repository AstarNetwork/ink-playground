import React from 'react';
import {Grid,Button} from '@material-ui/core'
import './App.css';

const App = () => {
	return (
		<div className="App">
			<div className="App-header">
					<div style={{textAlign:"center"}}>
						<h1>ink! playground</h1>
					</div>
			</div>
			<Grid container >
				<Grid item xs={6} style={{padding:"10px"}}>
					<textarea  id="librs" rows="10" style={{width:"80%",marginBottom:"20px",marginTop:"20px"}} placeholder="input your ink! code here"/>
					<Button  variant="contained" color="primary" style={{width:"80%",marginTop:"10px",marginBottom:"10px"}} >
						Compile Code
					</Button>
				</Grid>
			</Grid>
		</div>
	);
}

export default App;
