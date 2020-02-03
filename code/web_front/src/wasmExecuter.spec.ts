import { TypeRegistry } from '@polkadot/types';
import { Abi } from '@polkadot/api-contract';
import { ImportObject } from './wasmExecuter';
import { ContractABIPre } from '@polkadot/api-contract/types';

describe('WasmExecuter', () : void=>{
    const registry = new TypeRegistry();

    var metadata = require( './sample_metadata.json' );
    let abi = new Abi( registry, metadata );

    test('Make Instance',():void=>{
        expect(Object.values(abi.abi.contract.messages).map(({ name }): string => name)).toEqual(['flip', 'get']);
    })
})