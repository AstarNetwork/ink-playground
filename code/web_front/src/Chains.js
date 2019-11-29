export default {
		local:{
			ws_provider : "ws://127.0.0.1:9944",
			types : {
			},
		},
		flaming_fir: {
			ws_provider: "wss://substrate-rpc.parity.io",
			types: {}
		},
		plasm_testnet: {
			ws_provider: "wss://testnet.plasmnet.io",
			types: {
				Parameters: {
					canBeNominated : "bool",
					optionExpired : "u128",
					optionP: "u128"
				},
				BTreeSet: {}
			},				
		},
}
