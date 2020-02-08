import { Vec, u8, TypeRegistry } from '@polkadot/types'
import { Registry } from '@polkadot/types/types';

export function getBodyFromMessage(message: Uint8Array,registry: Registry){
    let vec: Vec<u8> = new Vec(registry, 'u8', message);
    let body = new Uint8Array(vec.length);
    vec.forEach((e,i)=>{body[i] = e.toNumber()});
    return body;
}