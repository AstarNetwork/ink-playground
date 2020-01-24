import { ResizableBuffer, ImportedObject } from "./wasmExecuter";

describe('WasmExecuter',():void=>{
    test('ResizableBuffer',():void=>{
        var x = new ArrayBuffer(5);
        var x_ = new Uint8Array([0,12,3])
        var y = new ResizableBuffer(x,0);
        y.set(x_)
    })
})