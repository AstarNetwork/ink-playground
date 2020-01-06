export default {
		local:{
			id: 'local',
			ws_provider : "ws://127.0.0.1:9944",
			types : {
			},
			name : "Local Node",
		},
		flaming_fir: {
			id: 'flaming_fir',
			ws_provider: "wss://substrate-rpc.parity.io",
			types: {},
			name : "Flaming Fir",
		},
		plasm_testnet: {
			id: 'plasm_testnet',
			ws_provider: "wss://testnet.plasmnet.io",
			types: {
				Parameters: {
					canBeNominated : "bool",
					optionExpired : "u128",
					optionP: "u128"
				},
				BTreeSet: {}
			},
			name : "Plasm Testnet V2",
		},
}