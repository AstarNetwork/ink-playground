import fs from 'fs'
import path from 'path';
import { TypeRegistry } from '@polkadot/types';
import { Abi } from '@polkadot/api-contract';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { createType } from '@polkadot/types';
import { ImportObject } from './wasmExecuter';
import { Keyring } from '@polkadot/api';
import { bufferToU8a } from '@polkadot/util';
import { getBodyFromMessage } from './util/Decode';

describe('WasmExecuter', () =>{
    const registry = new TypeRegistry();
    const keyring = new Keyring({ type: 'sr25519' });

    var metadata = require( './sample_metadata.json' );
    let buf = fs.readFileSync(path.resolve(__dirname, './sample.wasm'),{encoding: null});
    let wasm = bufferToU8a(buf);
    let abi = new Abi( registry, metadata );

    test('abi',():void=>{
        expect(Object.values(abi.abi.contract.messages).map(({ name }): string => name)).toEqual(['flip', 'get']);
    })
    test('create instance',async () =>{
        await cryptoWaitReady();
        const alice = keyring.addFromUri('//Alice');
        const bob = keyring.addFromUri('//Bob');    
        let importObject = new ImportObject(createType(abi.registry,'AccountId',alice.publicKey),abi,0);
        const instance = await WebAssembly.instantiate(wasm, importObject as any)
        const [exports_deploy, exports_call] = [instance.instance.exports.deploy as Function, instance.instance.exports.call as Function]
        const func_new = abi.constructors[0];
        let message_new = func_new(true);
        expect(message_new).toEqual(Uint8Array.from([20,94,189,136,214,1]));
        let messageBody_new = getBodyFromMessage(message_new,abi.registry);
        expect(messageBody_new).toEqual(Uint8Array.from([94,189,136,214,1]));
        importObject.scratch_buf.set(messageBody_new);
        importObject.scratch_buf_len=messageBody_new.length;
        expect(exports_deploy()).toEqual(0);

        //get() -> true
        let message_get = getBodyFromMessage(abi.messages.get(),abi.registry);
        expect(message_get).toEqual(Uint8Array.from([37,68,74,254]));
        importObject.scratch_buf.set(message_get);
        importObject.scratch_buf_len=message_get.length;
        expect(exports_call()).toEqual(0);
        //result: true
        expect(importObject.scratch_buf.subarray(0,importObject.scratch_buf_len))
            .toEqual(Uint8Array.from([1]));

        //flip(), get()->false
        let message_flip = getBodyFromMessage(abi.messages.flip(),abi.registry);
        importObject.scratch_buf.set(message_flip);
        importObject.scratch_buf_len=message_flip.length;
        expect(exports_call()).toEqual(0);
        importObject.scratch_buf.set(message_get);
        importObject.scratch_buf_len=message_get.length;
        expect(exports_call()).toEqual(0);
        //result: false
        expect(importObject.scratch_buf.subarray(0,importObject.scratch_buf_len))
            .toEqual(Uint8Array.from([0]));

    })
})