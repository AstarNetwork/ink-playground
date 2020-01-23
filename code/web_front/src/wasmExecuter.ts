class ResizableBuffer extends Uint8Array {
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
        return super.subarray(begin, end);
    };
    set(array: ArrayLike<number>, offset?: number | undefined ){
        return super.set(array, offset);
    };

}

export class importObject {
    constructor(){
        this.scratch_buf_memory = new WebAssembly.Memory({initial:2, maximum:16});
        const local_memory = new WebAssembly.Memory({initial:2, maximum:16});
        this.scratch_buf = new ResizableBuffer(this.scratch_buf_memory.buffer,0);
        this.local = new Uint8Array(local_memory.buffer);
        this.ctx_storage = {};
    }
    scratch_buf_memory: WebAssembly.Memory;
    scratch_buf :ResizableBuffer;
    local : Uint8Array;
    ctx_storage:{[x:string]: Uint8Array};

    env = {
        //from here
        memory: this.scratch_buf_memory,
        ext_set_storage:(
            key_ptr: number,
            value_non_null: number,
            value_ptr: number,
            value_len: number,
        )=>{
            const key = this.local.subarray(key_ptr,key_ptr+32);
            var value;
            if(value_non_null!=0){
                value = this.local.subarray(value_ptr,value_ptr+value_len);
            }else{
                value = null;
            }
            this.ctx_storage[key.toString()]=value.toString();
        },
        ext_get_storage:(key_ptr: number): number =>{
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
            return this.scratch_buf.length;
        },
        ext_scratch_read:(dst_ptr: number, offset: number, len: number)=>{
            if( offset > this.scratch_buf.length ) {
                return 1;
            };
            const src = this.scratch_buf.subarray(offset,offset+this.scratch_buf.length);
            if( this.scratch_buf.length != len ){
                return 1;
            }
            this.local.set(src,dst_ptr);
            return 0;
        },
        ext_scratch_write:(src_ptr: number, len: number)=>{
            this.scratch_buf.set(this.local.subarray(src_ptr,src_ptr+len));
            this.scratch_buf.length = len;
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

