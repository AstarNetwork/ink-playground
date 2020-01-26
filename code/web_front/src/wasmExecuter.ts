const bytesPerPage = 64 * 1024;

function growif(mem : WebAssembly.Memory,byteLength: number){
    var growPages = Math.ceil(byteLength / bytesPerPage) - mem.buffer.byteLength / bytesPerPage;
    if(growPages > 0){
        mem.grow(growPages);
        console.log('grow '+growPages+' pages');
        return true;
    }
    return false;
}

export class ImportObject {
    scratch_buf_len: number;
    ctx_storage:{[x:string]: Uint8Array};
    env:any;

    constructor(){
        this.scratch_buf_len = 0;
        this.ctx_storage = {};
        this.env = {
            memory: new WebAssembly.Memory({initial:2, maximum:16}),
            //from here
            ext_set_storage:(
                key_ptr: number,
                value_non_null: number,
                value_ptr: number,
                value_len: number,
            )=>{
                console.log('ext_set_storage');
                const local = new Uint8Array(this.env.memory.buffer);
                const key = local.subarray(key_ptr,key_ptr+32);
                var value;
                if(value_non_null!==0){
                    value = local.subarray(value_ptr,value_ptr+value_len);
                }else{
                    value = null;
                }
                this.ctx_storage[key.toString()]=value.toString();
            },
            ext_get_storage:(key_ptr: number): number =>{
                console.log('ext_get_storage(key_ptr: '+key_ptr+')');
                const local = new Uint8Array(this.env.memory.buffer);
                const key = local.subarray(key_ptr,key_ptr+32);
                const key_str = key.toString();
                if(this.ctx_storage.hasOwnProperty(key_str)){
                    local.set(this.ctx_storage[key_str]);
                    return 0;
                }else{
                    return 1;
                }
            },
            ext_scratch_size:(): number => {
                console.log('ext_scratch_size()');
                console.log('result:' + this.scratch_buf_len);
                return this.scratch_buf_len;
            },
    
            //scratch -> sandbox
            ext_scratch_read:(dst_ptr: number, offset: number, len: number)=>{
                console.log('ext_scratch_read(dst_ptr: '+dst_ptr+', offset: '+offset+',len: '+len+')');
                var local = new Uint8Array(this.env.memory.buffer);
                if( offset > this.scratch_buf_len ) {
                    console.log('result: 1');
                    return 1;
                };
                if( this.scratch_buf_len !== len ){
                    console.log('result: 1');
                    return 1;
                }
                // if(growif(this.env.memory,dst_ptr+len)){
                //     local = new Uint8Array(this.env.memory.buffer);
                // }
                const src = local.subarray(offset,offset+len);
                local.set(src,dst_ptr);
                console.log('result: 0');
                return 0;
            },
            //sandbox -> scratch
            ext_scratch_write:(src_ptr: number, len: number)=>{
                console.log('ext_scratch_write');
                const local = new Uint8Array(this.env.memory.buffer);
                local.set(local.subarray(src_ptr,src_ptr+len));
                this.scratch_buf_len = len;
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
            ext_deposit_event:(
                topics_ptr: number,
                topics_len: number,
                data_ptr: number,
                data_len: number,
            )=>{},
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
            ext_println: (str_ptr: number, str_len: number)=>{
    
            },
        }
    }
};

