/**
 * small encapsulator around WebGL state
 * @module GLContextObject
 */

class GLContextObject {
    /**
     * remember GL context
     * @param {WebGLRenderingContext} gl 
     */
    constructor(gl) {
        this.gl = gl;
    }
}

export default GLContextObject;