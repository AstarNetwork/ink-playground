import { RegistryTypes } from "@polkadot/types/types";

export type ChainId = 'local' | 'flaming_fir' | 'plasm_testnet' | 'custom';

export type ChainSetting = {
	id: ChainId;
	ws_provider: string;
	types: RegistryTypes;
	name: string;
}

const Chains:{[chainId:string]: ChainSetting}  ={
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
				optionP: "u32"
			},
			BTreeSet: {}
		},
		name : "Dusty Plasm",
	},
}

export default Chains