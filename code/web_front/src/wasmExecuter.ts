import { GenericEvent as Event } from '@polkadot/types';
import { TypeRegistry } from '@polkadot/types';

const registry = new TypeRegistry();

const bytesPerPage = 64 * 1024;

// function growif(mem : WebAssembly.Memory,byteLength: number){
//     var growPages = Math.ceil(byteLength / bytesPerPage) - mem.buffer.byteLength / bytesPerPage;
//     if(growPages > 0){
//         mem.grow(growPages);
//         console.log('grow '+growPages+' pages');
//         return true;
//     }
//     return false;
// }

export class ImportObject {
    scratch_buf_len: number;
    scratch_buf: Uint8Array;
    caller: string;
    balance: number;
    ctx_storage: {[x:string]: Uint8Array};
    env: any;
    init: boolean;

    constructor(caller: string, balance = 0){
        this.scratch_buf_len = 0;
        this.scratch_buf = new Uint8Array(bytesPerPage);
        this.balance = balance;
        this.caller = caller;
        this.ctx_storage = {};
        this.init = false;
        this.env = {
            memory: new WebAssembly.Memory({initial:2, maximum:16}),
            //from here
            ext_set_storage:(
                key_ptr: number,
                value_non_null: number,
                value_ptr: number,
                value_len: number,
            )=>{
                console.log(`[CALLED] ext_set_storage(key_ptr: ${key_ptr}, value_non_null: ${value_non_null}, value_ptr: ${value_ptr}, value_len: ${value_len})`);
                const local = new Uint8Array(this.env.memory.buffer);
                const key = local.subarray(key_ptr,key_ptr+32);
                const key_str = key.toString();
                var value;
                if(value_non_null!==0){
                    value = local.slice(value_ptr,value_ptr+value_len);
                }else{
                    value = null;
                }
                console.log(`[DEBUG] key:${key_str}, value:${value.toString()}`);
                this.ctx_storage[key_str]=value;
            },
            ext_get_storage:(key_ptr: number): number =>{
                console.log(`[CALLED] ext_get_storage(key_ptr: ${key_ptr})`);
                const local = new Uint8Array(this.env.memory.buffer);
                const key = local.subarray(key_ptr,key_ptr+32);
                const key_str = key.toString();
                console.log(`[DEBUG] key:${key_str}`);
                if(this.ctx_storage.hasOwnProperty(key_str)){
                    var value = this.ctx_storage[key_str];
                    console.log(`[DEBUG] value: ${value.toString()}`);
                    this.scratch_buf.set(this.ctx_storage[key_str]);
                    this.scratch_buf_len = this.ctx_storage[key_str].length;

                    console.log(`[DEBUG] return 0`);
                    return 0;
                }else{
                    console.log(`[DEBUG] return 1`);
                    return 1;
                }
            },
            ext_scratch_size:(): number => {
                console.log('ext_scratch_size()');
                console.log(`[DEBUG] return ${this.scratch_buf_len}`);
                return this.scratch_buf_len;
            },
    
            //scratch -> sandbox
            ext_scratch_read:(dst_ptr: number, offset: number, len: number)=>{
                console.log(`[CALLED] ext_scratch_read(dst_ptr: ${dst_ptr}, offset: ${offset}, len: ${len})`);
                var local = new Uint8Array(this.env.memory.buffer);
                if( offset > this.scratch_buf_len ) {
                    console.log('[DEBUG] return: 1');
                    return 1;
                };
                if( this.scratch_buf_len !== len ){
                    console.log('[DEBUG] return: 1');
                    return 1;
                }
                // if(growif(this.env.memory,dst_ptr+len)){
                //     local = new Uint8Array(this.env.memory.buffer);
                // }
                const src = this.scratch_buf.subarray(offset,offset+len);
                local.set(src,dst_ptr);
                console.log('result: 0');
                return 0;
            },

            //sandbox -> scratch
            ext_scratch_write:(src_ptr: number, len: number)=>{
                console.log(`[CALLED] ext_scratch_write(src_ptr: ${src_ptr}, len: ${len})`);
                const local = new Uint8Array(this.env.memory.buffer);
                this.scratch_buf.set(local.subarray(src_ptr,src_ptr+len));
                this.scratch_buf_len = len;
            },

            ext_println: (str_ptr: number, str_len: number)=>{
                const local = new Uint8Array(this.env.memory.buffer);
                console.log(`[CALLED] ext_println(str_ptr: ${str_ptr}, str_len: ${str_len})`);
                console.log(local.subarray(str_ptr,str_ptr+str_len));
            },

            ext_deposit_event:(
                topics_ptr: number,
                topics_len: number,
                data_ptr: number,
                data_len: number,
            )=>{
                console.log(`[CALLED] ext_println(topics_ptr: ${topics_ptr}, topics_len: ${topics_len}, data_len: ${data_len}, data_ptr: ${data_ptr})`);
                const local = new Uint8Array(this.env.memory.buffer);
                if(topics_len === 0){
                    var topics = Event.decodeEvent(registry);
                }else{
                    const buffer = local.subarray(topics_ptr,topics_ptr+topics_len);
                    //Decode from buffer to event
                    var topics = Event.decodeEvent(registry,buffer);
                }
            },
    
            // until here
            ext_instantiate: (
                code_hash_ptr: number,
                code_hash_len: number,
                gas: number,
                value_ptr: number,
                value_len: number,
                input_data_ptr: number,
                input_data_len: number,
            )=>{
    
            },
            ext_call: (
                callee_ptr: number,
                callee_len: number,
                gas: number,
                value_ptr: number,
                value_len: number,
                input_data_ptr: number,
                input_data_len: number,
            ):number => {
                return 0;
            },
            ext_get_runtime_storage:(key_ptr: number, key_len: number):number => {
                return 0;
            },
            ext_restore_to:(
                dest_ptr: number,
                dest_len: number,
                code_hash_ptr: number,
                code_hash_len: number,
                rent_allowance_ptr: number,
                rent_allowance_len: number,
                delta_ptr: number,
                delta_count: number,
            )=>{},
            ext_dispatch_call:(call_ptr: number, call_len: number)=>{},
            ext_caller: ()=>{
    
            },
            ext_block_number: ()=>{
    
            },
            ext_address:() =>{
    
            },
            ext_balance: ()=> {
    
            },
            ext_gas_price: ()=> {
                return 0;
            },
            ext_gas_left: ()=> {
    
            },
            ext_value_transferred:()=>{
    
            },
            ext_now:()=>{
    
            },
            ext_rent_allowance:()=>{
    
            },
            ext_minimum_balance:()=>{
    
            },
            ext_set_rent_allowance: (value_ptr: number, value_len: number)=>{
    
            },
            ext_random_seed: (subject_ptr: number, subject_len: number)=>{
    
            },

        }
    }
};

