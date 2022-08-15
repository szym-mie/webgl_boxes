/**
 * shader program creation
 * @module Program
 */

import GLContextObject from './GLContextObject';
import Shader from './Shader';
import Buffer from './Buffer';
import Texture2D from './Texture2D';
import TextureCubemap from './TextureCubemap';
import Vector3 from './Vector3';
import Vector4 from './Vector4';

class Program extends GLContextObject {
    /**
     * create a program, compiling shaders and linking them
     * @see module:Shader
     * @constructs
     * @param {WebGLRenderingContext} gl 
     * @param {string} vertexSrc 
     * @param {string} fragmentSrc 
     * @throws {Error} when a program cannot be linked
     */
    constructor(gl, vertexSrc, fragmentSrc, attribs, uniforms) {
        super(gl);
        const vertexShader = new Shader(gl, vertexSrc, this.gl.VERTEX_SHADER);
        const fragmentShader = new Shader(gl, fragmentSrc, this.gl.FRAGMENT_SHADER);

        this.program = this.gl.createProgram();

        vertexShader.attachTo(this.program);
        fragmentShader.attachTo(this.program);

        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            throw new Error("program error\n" + this.gl.getProgramInfoLog(this.program));
        }

        this.attribs = this.getAttribLocations(attribs);
        this.uniforms = this.getUniformLocations(uniforms);
    }

    /**
     * use this program to draw buffers
     * this does not bind any of locations, use Mesh to do that
     */
    use() {
        this.gl.useProgram(this.program);
    }

    /**
     * get uniform locations of a program by names
     * @private
     * @param {Array<string>} locationNames 
     * @returns {Map<string, number>}
     */
    getUniformLocations(locationNames) {
        const locations = new Map();
    
        for (const locationName of locationNames) {
            const location = this.gl.getUniformLocation(this.program, locationName);
            locations.set(locationName, location);
        }
    
        return locations;
    }

    /**
     * get attribute locations of a program by names
     * @private
     * @param {Array<string>} locationNames 
     * @returns {Map<string, number>}
     */
    getAttribLocations(locationNames) {
        const locations = new Map();
    
        for (const locationName of locationNames) {
            const location = this.gl.getAttribLocation(this.program, locationName);
            locations.set(locationName, location);
        }
    
        return locations;
    }

    /**
     * 
     * @param {string} location 
     * @param {Buffer} buffer 
     * @param {number} components 
     * @param {GLenum} type 
     * @param {boolean} normalize 
     * @param {number} stride 
     * @param {number} offset 
     */
    bindArrayBuffer(location, buffer, stride=0, offset=0) {
        const attrib = this.attribs.get(location)
        this.gl.enableVertexAttribArray(attrib);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer.buffer);
        this.gl.vertexAttribPointer(
            attrib,
            buffer.components,
            buffer.arrayType,
            buffer.normalize,
            stride,
            offset
        );
    }
    
    /**
     * 
     * @param {Buffer} buffer 
     */
    bindElementArrayBuffer(buffer) {
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer.buffer);
    }

    /**
     * 
     * @param {string} location 
     * @param {Matrix4} matrix4 
     */
    bindMatrix4(location, matrix4) {
        this.gl.uniformMatrix4fv(this.uniforms.get(location), false, matrix4);
    }

    /**
     * 
     * @param {string} location 
     * @param {number} unit 
     * @param {Texture2D|TextureCubemap} texture 
     */
    bindTexture(location, unit, texture) {
        texture.bindTextureUnit(unit);
        this.gl.uniform1i(this.uniforms.get(location), unit);
    }

    /**
     * 
     * @param {string} location 
     * @param {number} float 
     */
    bindFloat(location, float) {
        this.gl.uniform1f(this.uniforms.get(location), float);
    }

    /**
     * 
     * @param {string} location 
     * @param {Vector3} vector 
     */
    bindVector3(location, vector) {
        this.gl.uniform3fv(this.uniforms.get(location), vector);
    }

    /**
     * 
     * @param {string} location 
     * @param {Vector4} vector 
     */
    bindVector4(location, vector) {
        this.gl.uniform4fv(this.uniforms.get(location), vector);
    }
}

export default Program;

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */
