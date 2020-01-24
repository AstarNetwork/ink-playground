const bytesPerPage = 64 * 1024;

function growif(mem : WebAssembly.Memory,byteLength: number){
    var pages = Math.ceil(byteLength / bytesPerPage);
    if(pages !== mem.buffer.byteLength / bytesPerPage){
        mem.grow(pages);
        return true;
    }
    return false;
}

export class ResizableBuffer extends Uint8Array {
    _size: number;
    constructor(ab: ArrayBuffer, _size: number){
        super(ab);
        this._size = _size;
    };
    get length(){
        return this._size
    };
    set length(_size: number){
        this._size=_size;
    }
    subarray(begin?:number, end?:number){
        var res = super.subarray(begin, end) as ResizableBuffer;
        res._size=res.length;
        return res;
    };
}

export class ImportObject {
    constructor(){
        this.scratch_buf_memory = new WebAssembly.Memory({initial:2, maximum:16});
        this.env.memory = this.scratch_buf_memory;
        this.scratch_buf = new Uint8Array(this.scratch_buf_memory.buffer);
        this.scratch_buf_len = 0;
        this.local_memory = new WebAssembly.Memory({initial:2, maximum:16});
        this.local = new Uint8Array(this.local_memory.buffer);
        this.ctx_storage = {};
    }
    scratch_buf_memory: WebAssembly.Memory;
    scratch_buf: Uint8Array;
    scratch_buf_len: number;
    local_memory: WebAssembly.Memory;
    local : Uint8Array;
    ctx_storage:{[x:string]: Uint8Array};

    env = {
        memory: WebAssembly.Memory.prototype,
        //from here
        ext_set_storage:(
            key_ptr: number,
            value_non_null: number,
            value_ptr: number,
            value_len: number,
        )=>{
            console.log('ext_set_storage');
            const key = this.local.subarray(key_ptr,key_ptr+32);
            var value;
            if(value_non_null!==0){
                value = this.local.subarray(value_ptr,value_ptr+value_len);
            }else{
                value = null;
            }
            this.ctx_storage[key.toString()]=value.toString();
        },
        ext_get_storage:(key_ptr: number): number =>{
            console.log('ext_get_storage');
            const key = this.local.subarray(key_ptr,key_ptr+32);
            const key_str = key.toString();
            if(this.ctx_storage.hasOwnProperty(key_str)){
                this.scratch_buf.set(this.ctx_storage[key_str]);
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
            console.log('ext_scratch_read(dst_ptr: '+dst_ptr+', offset: '+offset+',len: '+len);
            if( offset > this.scratch_buf_len ) {
                return 1;
            };
            if( this.scratch_buf_len !== len ){
                return 1;
            }
            if(growif(this.local_memory,dst_ptr+len)){
                this.local = new Uint8Array(this.local_memory.buffer);
            }
            const newBuf = new Uint8Array(this.scratch_buf_memory.buffer);
            const src = newBuf.subarray(offset,offset+len);
            this.local.set(src,dst_ptr);
            return 0;
        },
        //sandbox -> scratch
        ext_scratch_write:(src_ptr: number, len: number)=>{
            console.log('ext_scratch_write');
            this.scratch_buf.set(this.local.subarray(src_ptr,src_ptr+len));
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
};

