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
     * @param {TypedArray} array 
     * @param {number} components
     * @param {boolean} normalize
     */
    constructor(gl, array, bufferType, components, normalize) {
        super(gl);
        this.buffer = this.gl.createBuffer();
        this.bufferType = bufferType;
        this.dataType = Buffer.BufferDataTypes[array.constructor];
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

    /**
     * enum for getting GL types
     * @readonly
     * @enum {GLenum}
     */
    static BufferDataTypes = {
        [Uint8Array]: WebGLRenderingContext.UNSIGNED_BYTE,
        [Uint16Array]: WebGLRenderingContext.UNSIGNED_SHORT,
        [Uint32Array]: WebGLRenderingContext.UNSIGNED_INT,
        [Float32Array]: WebGLRenderingContext.FLOAT
    }
}

export default Buffer;

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */
