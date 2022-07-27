/**
 * shader creation, binding uniforms, attributes
 * @module Shader
 * a typed array for use with buffers
 * @typedef {Uint8Array|Uint16Array|Uint32Array|Float32Array} TypedArray 
 */

import GLContextObject from './GLContextObject';

class Shader extends GLContextObject {
    constructor(gl, src, type) {
        super(gl);
        this.shader = this.gl.createShader(type);

        this.gl.shaderSource(this.shader, src);

        this.gl.compileShader(this.shader);
        if (!this.gl.getShaderParameter(this.shader, this.gl.COMPILE_STATUS)) {
            throw new Error("shader error\n" + this.gl.getShaderInfoLog(this.shader));
        }
    }

    /**
     * attach this shader to a given program
     * @param {WebGLProgram} program program to attach to
     */
    attachTo(program) {
        this.gl.attachShader(program, this.shader);
    }
}

/**
 * create and compile a shader
 * @param {WebGLRenderingContext} gl 
 * @param {string} src 
 * @param {number} type 
 * @returns {WebGLShader} a new shader ID
 * @throws {Error} when a shader cannot be compiled
 */
function newShader(gl, src, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);

    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error("shader error\n" + gl.getShaderInfoLog(shader));
    }

    return shader;
}

export default Shader;

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */
