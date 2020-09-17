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
		ws_provider: "wss://rpc.dusty.plasmnet.io",
		types: {
			AuthorityId: 'AccountId',
			AuthorityVote: 'u32',
			Claim: {
			  amount: 'u128',
			  approve: 'BTreeSet<AuthorityId>',
			  complete: 'bool',
			  decline: 'BTreeSet<AuthorityId>',
			  params: 'Lockdrop'
			},
			ClaimId: 'H256',
			ClaimVote: {
			  approve: 'bool',
			  authority: 'u16',
			  claim_id: 'ClaimId'
			},
			DollarRate: 'u128',
			Keys: 'SessionKeys2',
			Lockdrop: {
			  duration: 'u64',
			  public_key: '[u8; 33]',
			  transaction_hash: 'H256',
			  type: 'u8',
			  value: 'u128'
			},
			PredicateHash: 'H256',
			TickerRate: {
			  authority: 'u16',
			  btc: 'u128',
			  eth: 'u128'
			}
		},
		name : "Dusty Plasm",
	},
}

export default Chains