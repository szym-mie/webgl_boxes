/**
 * creation of typed array buffers and payload manipulation
 * @module Buffer
 */

/**
 * a typed array for use with buffers
 * @typedef {Uint8Array|Uint16Array|Uint32Array|Float32Array} TypedArray 
 */

import GLContextObject from './GLContextObject';

class Buffer extends GLContextObject {
    /**
     * create a new GL buffer
     * @constructs
     * @param {WebGLRenderingContext} gl 
     * @param {GLenum} bufferType a type of buffer - array or element array
     * @param {TypedArray} array 
     * @param {GLenum} arrayType a data type
     * @param {number} components
     * @param {boolean} normalize
     */
    constructor(gl, bufferType, array, arrayType, components, normalize) {
        super(gl);
        this.buffer = this.gl.createBuffer();
        this.arrayType = arrayType;
        this.bufferType = bufferType;
        this.components = components;
        this.normalize = normalize;
        this.size = 0;
        this.vertexCount = 0;

        this.setBuffer(array);
    }

    /**
     * set a buffer data to typed array
     * @param {TypedArray} array 
     */
    setBuffer(array) {
        this.gl.bindBuffer(this.bufferType, this.buffer);
        this.gl.bufferData(this.bufferType, array, this.gl.STATIC_DRAW);
        this.size = array.length;
        this.vertexCount = Math.floor(this.size / this.components);
    }
}

export default Buffer;

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */
