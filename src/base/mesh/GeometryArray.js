/**
 * a typed array for use with buffers
 * @typedef {Uint8Array|Uint16Array|Uint32Array|Float32Array} TypedArray 
 * @typedef {function(array:Array<number>|ArrayBuffer):TypedArray} TypedArrayConstructor
 */

class GeometryArray {
    /**
     * 
     * @param {Array<number>|ArrayBuffer} array 
     * @param {number} components 
     * @param {number} arrayType
     */
    constructor(array, components, arrayType) {
        this.array = new GeometryArray.GL_TYPED_ARRAY_CONSTRUCTORS[arrayType](array);
        this.components = components;
        this.arrayType = arrayType;
    }

    /**
     * a conversion between GL types and typed array constructor
     * @enum {TypedArrayConstructor}
     */
    static GL_TYPED_ARRAY_CONSTRUCTORS = {
        5120: Int8Array,
        5121: Uint8Array,
        5122: Int16Array,
        5123: Uint16Array,
        5124: Int32Array,
        5125: Uint32Array,
        5126: Float32Array
    }
}

export default GeometryArray;

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */
