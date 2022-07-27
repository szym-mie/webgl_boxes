/**
 * creation of 2D textures
 * @module Texture2D
 */

import GLContextObject from './GLContextObject';

class Texture2D extends GLContextObject {
    /**
     * create a new 2D texture
     * @constructs
     * @param {WebGLRenderingContext} gl 
     * @param {TexImageSource} image 
     * @param {GLenum} internalFormat
     * @param {GLenum} format 
     */
    constructor(gl, image, internalFormat, format) {
        super(gl);
        this.texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texImage2D(
            this.gl.TEXTURE_2D, 
            0, 
            internalFormat, 
            format, 
            this.gl.UNSIGNED_BYTE, 
            image
        );
    
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
    }

    setFilters(minFilter, magFilter) {
        this.gl.texParameteri(
            this.gl.TEXTURE_2D, 
            this.gl.TEXTURE_MIN_FILTER, 
            minFilter
        );
        this.gl.texParameteri(
            this.gl.TEXTURE_2D, 
            this.gl.TEXTURE_MAG_FILTER, 
            magFilter
        );

        this.gl.generateMipmap(this.gl.TEXTURE_2D);
    }

    /**
     * activates texture by binding it to a texture unit
     * @param {number} unit 
     */
    bindTextureUnit(unit) {
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.activeTexture(this.gl.TEXTURE0 + unit);
    }
}

export default Texture2D;

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */
