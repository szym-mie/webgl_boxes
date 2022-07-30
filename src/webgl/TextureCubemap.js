/**
 * creation of cubemap textures
 * @module TextureCubemap
 */

import GLContextObject from './GLContextObject';

class TextureCubemap extends GLContextObject {
    /**
     * create a new cubemap texture
     * @constructs
     * @param {WebGLRenderingContext} gl 
     * @param {Object} images
     * @param {HTMLImageElement} images.px
     * @param {HTMLImageElement} images.nx
     * @param {HTMLImageElement} images.py
     * @param {HTMLImageElement} images.ny
     * @param {HTMLImageElement} images.pz
     * @param {HTMLImageElement} images.nz
     * @param {GLenum} internalFormat 
     * @param {GLenum} format 
     */
    constructor(gl, images, internalFormat, format) {
        super(gl);
        this.texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.texture);

        console.log(images.px)
    
        this.gl.texImage2D(
            this.gl.TEXTURE_CUBE_MAP_POSITIVE_X,
            0,
            internalFormat,
            format,
            this.gl.UNSIGNED_BYTE,
            images.px
        );
        
        this.gl.texImage2D(
            this.gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
            0,
            internalFormat,
            format,
            this.gl.UNSIGNED_BYTE,
            images.nx
        );
    
        this.gl.texImage2D(
            this.gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
            0,
            internalFormat,
            format,
            this.gl.UNSIGNED_BYTE,
            images.py
        );
        
        this.gl.texImage2D(
            this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            0,
            internalFormat,
            format,
            this.gl.UNSIGNED_BYTE,
            images.ny
        );
    
        this.gl.texImage2D(
            this.gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
            0,
            internalFormat,
            format,
            this.gl.UNSIGNED_BYTE,
            images.pz
        );
        
        this.gl.texImage2D(
            this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
            0,
            internalFormat,
            format,
            this.gl.UNSIGNED_BYTE,
            images.nz
        );
        
        this.gl.generateMipmap(this.gl.TEXTURE_CUBE_MAP);
    }

    setFilters(minFilter, magFilter) {
        this.gl.texParameteri(
            this.gl.TEXTURE_CUBE_MAP, 
            this.gl.TEXTURE_MIN_FILTER, 
            minFilter
        );
        this.gl.texParameteri(
            this.gl.TEXTURE_CUBE_MAP, 
            this.gl.TEXTURE_MAG_FILTER, 
            magFilter
        );

        this.gl.generateMipmap(this.gl.TEXTURE_CUBE_MAP);
    }

    /**
     * activates texture by binding it to a texture unit
     * @param {number} unit 
     */
    bindTextureUnit(unit) {
        this.gl.activeTexture(this.gl.TEXTURE0 + unit);
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.texture);
    }
}


export default TextureCubemap;

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */
