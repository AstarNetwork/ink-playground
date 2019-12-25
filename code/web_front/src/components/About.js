import React from 'react';
import Button from '@material-ui/core/Button'

const About = ({handleClose}) => {
    return (<div>
        <h1>Ink! Playground</h1>
        <p>hosted by <a href="https://stake.co.jp/"> Stake Technologies</a></p>
        <h2>What is Ink?</h2>
        <p>Ink! is an eDSL to write WebAssembly based smart contracts using the Rust programming language targeting Substrate blockchains, which is implemented by Parity Technologies.</p>
        <h3>Github</h3> <a href = "https://github.com/paritytech/ink">https://github.com/paritytech/ink</a>
        <h3>Documents</h3> <a href = "https://substrate.dev/docs/en/ecosystem/contracts/ink">https://substrate.dev/docs/en/ecosystem/contracts/ink</a>
        <h3>Tutorial</h3> <a href = "https://substrate.dev/substrate-contracts-workshop">https://substrate.dev/substrate-contracts-workshop</a>

        <Button
            variant="contained"
            color="primary"
            onClick={()=>handleClose()}
        >
            Close
        </Button>
    </div>)
}

export default About