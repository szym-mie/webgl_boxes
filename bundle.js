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

/**
 * shader creation, binding uniforms, attributes
 * @module Shader
 * a typed array for use with buffers
 * @typedef {Uint8Array|Uint16Array|Uint32Array|Float32Array} TypedArray 
 */

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
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */

/**
 * creation of typed array buffers and payload manipulation
 * @module Buffer
 */

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

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */

/**
 * creation of 2D textures
 * @module Texture2D
 */

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

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */

/**
 * creation of cubemap textures
 * @module TextureCubemap
 */

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

        console.log(images.px);
    
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
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.texture);
        this.gl.activeTexture(this.gl.TEXTURE0 + unit);
    }
}

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */

/**
 * a 3-component vector
 * @module Vector3
 * @typedef {Vector4|Vector3|Vector2} AnyVector
 */

class Vector3 extends Float32Array {
    /**
     * create a new 3-component vector
     * @constructs
     * @param {Vector3?} vector
     */
    constructor(vector=null) {
        super(3);

        if (vector !== null) {
            this.setFrom(vector);
        }
    }

    /**
     * set a vector components, one-by-one style
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     * @returns {Vector3}
     */
    set(x, y, z) {
        this[0] = x;
        this[1] = y;
        this[2] = z;

        return this;
    }

    /**
     * set from another vector
     * @param {AnyVector} vector 
     * @returns {Vector3}
     */
    setFrom(vector) {
        this[0] = vector[0];
        this[1] = vector[1];
        this[2] = vector[2] || 0;

        return this;
    }

    /**
     * add another vector
     * @param {AnyVector} vector 
     * @returns {Vector3}
     */
    add(vector) {
        this[0] += vector[0];
        this[1] += vector[1];
        this[2] += vector[2] || 0;

        return this;
    }

    /**
     * subtract another vector
     * @param {AnyVector} vector 
     * @returns {Vector3}
     */
    subtract(vector) {
        this[0] -= vector[0];
        this[1] -= vector[1];
        this[2] -= vector[2] || 0;

        return this;
    }

    /**
     * multiply by another vector
     * @param {AnyVector} vector 
     * @returns {Vector3}
     */
    multiply(vector) {
        this[0] *= vector[0];
        this[1] *= vector[1];
        this[2] *= vector[2] || 0;

        return this;
    }

    /**
     * scale this vector
     * @param {number} scale 
     * @returns {Vector3}
     */
    scale(scale) {
        this[0] *= scale;
        this[1] *= scale;
        this[2] *= scale;

        return this;
    }

    /**
     * return a dot-product of two vectors
     * @param {Vector3} vectorA 
     * @param {Vector3} vectorB 
     * @returns {number}
     */
    static dot(vectorA, vectorB) {
        return (
            vectorA[0] * vectorB[0] +
            vectorA[1] * vectorB[1] +
            vectorA[2] * vectorB[2]
        );
    }
}

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */

/**
 * a 4-component vector
 * @module Vector4
 * @typedef {Vector4|Vector3|Vector2} AnyVector
 */

class Vector4 extends Float32Array {
    /**
     * create a new 4-component vector
     * @constructs
     * @param {Vector4?} vector
     */
    constructor(vector=null) {
        super(4);

        if (vector !== null) {
            this.setFrom(vector);
        }
    }

    /**
     * set a vector components, one-by-one style
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     * @param {number} w 
     * @returns {Vector4}
     */
    set(x, y, z, w) {
        this[0] = x;
        this[1] = y;
        this[2] = z;
        this[3] = w;

        return this;
    }

    /**
     * set from another vector
     * @param {AnyVector} vector 
     * @returns {Vector4}
     */
    setFrom(vector) {
        this[0] = vector[0];
        this[1] = vector[1];
        this[2] = vector[2] || 0;
        this[3] = vector[3] || 0;

        return this;
    }

    /**
     * add another vector
     * @param {AnyVector} vector 
     * @returns {Vector4}
     */
    add(vector) {
        this[0] += vector[0];
        this[1] += vector[1];
        this[2] += vector[2] || 0;
        this[3] += vector[3] || 0;

        return this;
    }

    /**
     * subtract another vector
     * @param {AnyVector} vector 
     * @returns {Vector4}
     */
    subtract(vector) {
        this[0] -= vector[0];
        this[1] -= vector[1];
        this[2] -= vector[2] || 0;
        this[3] -= vector[3] || 0;

        return this;
    }

    /**
     * multiply by another vector
     * @param {AnyVector} vector 
     * @returns {Vector4}
     */
    multiply(vector) {
        this[0] *= vector[0];
        this[1] *= vector[1];
        this[2] *= vector[2] || 0;
        this[3] *= vector[3] || 0;

        return this;
    }

    /**
     * scale this vector
     * @param {number} scale 
     * @returns {Vector4}
     */
    scale(scale) {
        this[0] *= scale;
        this[1] *= scale;
        this[2] *= scale;
        this[3] *= scale;

        return this;
    }

    /**
     * return a dot-product of two vectors
     * @param {Vector4} vectorA 
     * @param {Vector4} vectorB 
     * @returns {number}
     */
    static dot(vectorA, vectorB) {
        return (
            vectorA[0] * vectorB[0] +
            vectorA[1] * vectorB[1] +
            vectorA[2] * vectorB[2] +
            vectorA[3] * vectorB[3]
        );
    }
}

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */

/**
 * shader program creation
 * @module Program
 */

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
        const attrib = this.attribs.get(location);
        this.gl.enableVertexAttribArray(attrib);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer.buffer);
        this.gl.vertexAttribPointer(
            attrib,
            buffer.components,
            buffer.dataType,
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

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */

/**
 * basic operation on 4x4 matrices
 * @module Matrix4
 */

class Matrix4 extends Float32Array {
    /**
     * creates a new instance of matrix4
     * @constructor
     * @param {Matrix4?} matrix matrix to copy from
     */
    constructor(matrix=null) {
        super(16);

        if (matrix !== null) {
            this.setFrom(matrix);
        } else {
            this.setIdentity();
        }
    }

    /**
     * sets an identity matrix
     * @returns {Matrix4} this matrix
     */
    setIdentity() {
        this[0] = 1;
        this[1] = 0;
        this[2] = 0;
        this[3] = 0;
        this[4] = 0;
        this[5] = 1;
        this[6] = 0;
        this[7] = 0;
        this[8] = 0;
        this[9] = 0;
        this[10] = 1;
        this[11] = 0;
        this[12] = 0;
        this[13] = 0;
        this[14] = 0;
        this[15] = 1;

        return this;
    }

    /**
     * copy values from another Matrix4
     * @param {Matrix4} matrix matrix to copy from
     * @returns {Matrix4} this matrix
     */
    setFrom(matrix) {
        this[0] = matrix[0];
        this[1] = matrix[1];
        this[2] = matrix[2];
        this[3] = matrix[3];
        this[4] = matrix[4];
        this[5] = matrix[5];
        this[6] = matrix[6];
        this[7] = matrix[7];
        this[8] = matrix[8];
        this[9] = matrix[9];
        this[10] = matrix[10];
        this[11] = matrix[11];
        this[12] = matrix[12];
        this[13] = matrix[13];
        this[14] = matrix[14];
        this[15] = matrix[15];

        return this;
    }

    /**
     * transpose this matrix
     * @returns {Matrix4} this matrix
     */
    transpose() {
        let a01 = this[1],
            a02 = this[2],
            a03 = this[3];
        let a12 = this[6],
            a13 = this[7];
        let a23 = this[11];
    
        this[1] = this[4];
        this[2] = this[8];
        this[3] = this[12];
        this[4] = a01;
        this[6] = this[9];
        this[7] = this[13];
        this[8] = a02;
        this[9] = a12;
        this[11] = this[14];
        this[12] = a03;
        this[13] = a13;
        this[14] = a23;

        return this;
    }

    /**
     * invert this matrix
     * @returns {Matrix4} this matrix
     */
    invert() {
        let a00 = this[0],
            a01 = this[1],
            a02 = this[2],
            a03 = this[3];
        let a10 = this[4],
            a11 = this[5],
            a12 = this[6],
            a13 = this[7];
        let a20 = this[8],
            a21 = this[9],
            a22 = this[10],
            a23 = this[11];
        let a30 = this[12],
            a31 = this[13],
            a32 = this[14],
            a33 = this[15];

        let b00 = a00 * a11 - a01 * a10;
        let b01 = a00 * a12 - a02 * a10;
        let b02 = a00 * a13 - a03 * a10;
        let b03 = a01 * a12 - a02 * a11;
        let b04 = a01 * a13 - a03 * a11;
        let b05 = a02 * a13 - a03 * a12;
        let b06 = a20 * a31 - a21 * a30;
        let b07 = a20 * a32 - a22 * a30;
        let b08 = a20 * a33 - a23 * a30;
        let b09 = a21 * a32 - a22 * a31;
        let b10 = a21 * a33 - a23 * a31;
        let b11 = a22 * a33 - a23 * a32;

        let det =
            b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) {
            throw Error("matrix determinant is zero")
        }
        det = 1.0 / det;

        this[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        this[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        this[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        this[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        this[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        this[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        this[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        this[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        this[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        this[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        this[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        this[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        this[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        this[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        this[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        this[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

        return this;
    }

    /**
     * scale this matrix
     * @param {number} scale scale factor
     * @returns {Matrix4} this matrix
     */
    scale(scale) {
        this[0] *= scale;
        this[1] *= scale;
        this[2] *= scale;
        this[3] *= scale;
        this[4] *= scale;
        this[5] *= scale;
        this[6] *= scale;
        this[7] *= scale;
        this[8] *= scale;
        this[9] *= scale;
        this[10] *= scale;
        this[11] *= scale;
        this[12] *= scale;
        this[13] *= scale;
        this[14] *= scale;
        this[15] *= scale;
    
        return this;
    }

    /**
     * multiply this matrix by another Matrix4
     * @param {Matrix4} matrix other matrix
     * @returns {Matrix4} this matrix
     */
    multiply(matrix) {
        // a reference
        const m = this;
        const n = matrix;
    
        // columns of argument matrix.
        const col0 = new Vector4().set(m[0], m[4], m[8], m[12]);
        const col1 = new Vector4().set(m[1], m[5], m[9], m[13]);
        const col2 = new Vector4().set(m[2], m[6], m[10], m[14]);
        const col3 = new Vector4().set(m[3], m[7], m[11], m[15]);
    
        // rows of this matrix.
        const row0 = new Vector4().set(n[0], n[1], n[2], n[3]);
        const row1 = new Vector4().set(n[4], n[5], n[6], n[7]);
        const row2 = new Vector4().set(n[8], n[9], n[10], n[11]);
        const row3 = new Vector4().set(n[12], n[13], n[14], n[15]);
    
        m[0] = Vector4.dot(row0, col0);
        m[1] = Vector4.dot(row0, col1);
        m[2] = Vector4.dot(row0, col2);
        m[3] = Vector4.dot(row0, col3);
        
        m[4] = Vector4.dot(row1, col0);
        m[5] = Vector4.dot(row1, col1);
        m[6] = Vector4.dot(row1, col2);
        m[7] = Vector4.dot(row1, col3);
        
        m[8] = Vector4.dot(row2, col0);
        m[9] = Vector4.dot(row2, col1);
        m[10] = Vector4.dot(row2, col2);
        m[11] = Vector4.dot(row2, col3);
    
        m[12] = Vector4.dot(row3, col0);
        m[13] = Vector4.dot(row3, col1);
        m[14] = Vector4.dot(row3, col2);
        m[15] = Vector4.dot(row3, col3);
    
        return this;
    }

    /**
     * set translation of this matrix
     * @param {Vector3} vector translation vector
     * @returns {Matrix4} this matrix
     */
    setTranslation(vector) {
        this[12] = vector[0];
        this[13] = vector[1];
        this[14] = vector[2] || 0;
    
        return this;
    }

    /**
     * translate this matrix
     * @param {Vector3} vector translation vector
     * @returns {Matrix4} this matrix
     */
    translate(vector) {
        this[12] += vector[0];
        this[13] += vector[1];
        this[14] += vector[2] || 0;
    
        return this;
    }

    /**
     * set this matrix from axis vector and rotation angle
     * around this axis, does not reset translation
     * @param {Vector3} vector normalized axis pointing vector
     * @param {number} angle angle to rotate around
     * @returns {Matrix4} this matrix
     */
    setFromAxisAngle(vector, angle) {
        const x = vector[0];
        const y = vector[1];
        const z = vector[2] || 0;

        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const t = 1 - c;
        
        const txy = t*x*y;
        const tyz = t*y*z;
        const tzx = t*z*x;

        const xs = x*s;
        const ys = y*s;
        const zs = z*s;

        this[0] = t*x*x + c;
        this[1] = txy - zs;
        this[2] = tzx + ys;
        this[4] = txy + zs;
        this[5] = t*y*y + c;
        this[6] = tyz - xs;
        this[8] = tzx - ys;
        this[9] = tyz + xs;
        this[10] = t*z*z + c;

        return this;
    }

    /**
     * rotate around a X axis
     * @param {number} angle 
     * @returns {Matrix4}  this matrix
     */
    rotateX(angle) {
        const s = Math.sin(angle);
        const c = Math.cos(angle);

        this[5] = c;
        this[6] = s;
        this[9] = -s;
        this[10] = c;

        return this;
    }

    /**
     * rotate around a Y axis
     * @param {number} angle 
     * @returns {Matrix4}  this matrix
     */
    rotateY(angle) {
        const s = Math.sin(angle);
        const c = Math.cos(angle);

        this[0] = c;
        this[2] = -s;
        this[8] = s;
        this[10] = c;

        return this;
    }

    /**
     * rotate around a Z axis
     * @param {number} angle 
     * @returns {Matrix4}  this matrix
     */
    rotateZ(angle) {
        const s = Math.sin(angle);
        const c = Math.cos(angle);

        this[0] = c;
        this[1] = s;
        this[4] = -s;
        this[5] = c;

        return this;
    }

    /**
     * setup a matrix frustum
     * @param {number} bottom 
     * @param {number} top 
     * @param {number} left 
     * @param {number} right 
     * @param {number} near 
     * @param {number} far 
     * @returns {Matrix4} this matrix
     */
    setFrustum(bottom, top, left, right, near, far) {
        const dn = 2 * near;
        const sfn = near - far;
    
        this[0] = dn / (right - left);
        this[5] = dn / (top - bottom);
        this[10] = (far + near) / sfn;
        this[11] = -1;
        this[14] = dn * far / sfn;

        this[1] = 0;
        this[2] = 0;
        this[3] = 0;
        this[4] = 0;
        this[6] = 0;
        this[7] = 0;
        this[8] = 0;
        this[9] = 0;
        this[12] = 0;
        this[13] = 0;
        this[15] = 0;
    
        return this;
    }

    /**
     * setup a perspective matrix
     * @param {number} fov angle in radians
     * @param {number} aspect width/height
     * @param {number} near near plane distance
     * @param {number} far far plane distance
     * @returns {Matrix4} this matrix
     */
    setPerspective(fov, aspect, near, far) {
        const f = Math.tan((Math.PI - fov) / 2);

        this[0] = f / aspect;
        this[1] = 0;
        this[2] = 0;
        this[3] = 0;
        this[4] = 0;
        this[5] = f;
        this[6] = 0;
        this[7] = 0;
        this[8] = 0;
        this[9] = 0;
        this[10] = (near + far) / (near - far);
        this[11] = -1;
        this[12] = 0;
        this[13] = 0;
        this[14] = 2 * far * near / (near - far);
        this[15] = 0;
    
        // this.setFrustum(bottom, top, left, right, near, far);
    
        return this;
    }
}

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */

/**
 * a perspective camera, complete with matrices
 * @module Camera
 */

class Camera {
    /**
     * create a new camera
     * @constructor
     * @param {number} fov 
     * @param {number} aspect 
     * @param {number} near 
     * @param {number} far 
     */
    constructor(fov, aspect, near, far) {
        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;

        this.perspectiveMatrix = new Matrix4().setPerspective(fov, aspect, near, far);
        this.viewMatrix = new Matrix4();

        this.pvMatrix = new Matrix4(this.perspectiveMatrix).multiply(this.viewMatrix);
        this.pvInvMatrix = new Matrix4();
    }

    /**
     * update the camera matrices
     */
    resize() {
        this.perspectiveMatrix
        .setIdentity()
        .setPerspective(this.fov, this.aspect, this.near, this.far);

        this.update();
    }

    update() {
        this.pvMatrix
        .setFrom(this.perspectiveMatrix)
        .multiply(this.viewMatrix);

        const rotMatrix = new Matrix4(this.viewMatrix).setTranslation([0, 0, 0]);

        this.pvInvMatrix
        .setFrom(this.perspectiveMatrix)
        .multiply(rotMatrix)
        .invert();
    }
}

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */

/**
 * @module Resource
 */

class Resource {
    constructor(element) {
        this.elem = element;
        this.linked = new Map();
    }

    /**
     * 
     * @param {string} id 
     * @returns {Resource}
     */
    get(id) {
        return this.linked.get(id);
    }

    /**
     * return linked resource elements
     * @returns {Map<string, any>}
     */
    linkedElements() {
        return new Map([...this.linked.entries()].map(([k, v]) => [k, v.elem]));
    }

    /**
     * take a linked elements map, and convert to object
     * @returns {Object}
     */
    linkedElementsObject() {
        return Object.fromEntries(this.linkedElements());
    }
}

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */

/**
 * @module ResourceLoader
 */

/**
 * @abstract
 */
class ResourceLoader {
    /**
     * create a new resource loader for a given URL
     * @param {string|Object|Array<string>} url 
     * @param {Object} spec
     */
    constructor(url, spec={}) {
        this.url = url;
        this.spec = spec;
    }

    /**
     * load a primary resource, along with referenced ones
     * @returns {Promise<Resource>}
     */
    async load() {
        const resource = await this.loadResource();
        resource.linked = await this.loadReferencedResources(resource);

        return resource;
    }

    /**
     * a loading logic method
     * @abstract
     * @returns {Promise<Resource>}
     */
    loadResource() {}

    /**
     * get all other resources referenced by this resource
     * @abstract
     * @param {Resource} resource
     * @returns {Map<string, ResourceLoader>}
     */
    getReferencedResources(resource) {}

    /**
     * load all referenced resources, calling this method before loading 
     * primary resource will probably miss resources
     * @protected
     * @param {Resource} resource
     * @returns {Promise<Map<string, Resource>>}
     */
    async loadReferencedResources(resource) {
        const refResources = this.getReferencedResources(resource);
        const resIds = [...refResources.keys()];

        Promise.all([...refResources.values()].map(res => res.load()))
        .then(vals => {console.log(new Map(vals.map((val, idx) => [resIds[idx], val])));});

        return Promise.all([...refResources.values()].map(res => res.load()))
            .then(vals => new Map(vals.map((val, idx) => [resIds[idx], val])));
    }
}

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */

class ImageResourceLoader extends ResourceLoader {
    constructor(url, spec) {
        super(url, spec);
    }

    loadResource() {
        const image = new Image();
        image.src = this.url;

        return new Promise((resolve, reject) => {
            image.onload = async () => {
                resolve(new Resource(await createImageBitmap(image)));
            };
            image.onerror = () => {
                reject("bitmap cannot be loaded");
            };
        });
    }

    getReferencedResources(resource) {
        return new Map();
    }
}

class AudioBufferResourceLoader extends ResourceLoader {
    constructor(url, spec) {
        super(url, spec);
    }

    loadResource() {
        return fetch(this.url)
            .then(res => res.arrayBuffer())
            .then(elem => new Resource(elem));
    }

    getReferencedResources(resource) {
        return new Map();
    }
}

class TextResourceLoader extends ResourceLoader {
    constructor(url, spec) {
        super(url, spec);
    }

    loadResource() {
        return fetch(this.url)
            .then(res => res.text())
            .then(elem => new Resource(elem));
    }

    getReferencedResources(resource) {
        return new Map();
    }
}

class JsonResourceLoader extends ResourceLoader {
    constructor(url, spec) {
        super(url, spec);
    }

    loadResource() {
        return fetch(this.url)
            .then(res => res.json())
            .then(elem => new Resource(elem));    }

    getReferencedResources(resource) {
        return new Map();
    }
}

class CubemapResourceLoader extends ResourceLoader {
    constructor(urlInfo, spec) {
        super(urlInfo, spec);
    }

    loadResource() {
        return new Promise((resolve, _) => { resolve(new Resource(undefined)); });
    }

    getReferencedResources(resource) {
        const sides = ["px", "nx", "py", "ny", "pz", "nz"];

        console.log(new Map(sides.map(side => 
            [side, new ImageResourceLoader(this.url.start + side + this.url.end)]
        )));

        return new Map(sides.map(side => 
            [side, new ImageResourceLoader(this.url.start + side + this.url.end)]
        ));
    }
}

/**
 * small module for async loading of resources (images, models, audio, etc)
 * @module ResourceManager
 */

class ResourceManager {
    /**
     * create a new resource manager with custom loader types
     * @constructs
     * @param {Object} customTypes 
     */
    constructor(customTypes={}) {
        /**
         * @type {Object<string, function(url:string):ResourceLoader>} this.types
         */
        this.types = Object.assign(ResourceManager.DefaultResourceRequestType, customTypes);
        this.resourceSources = [];
        this.packageSources = [];
        this.resources = new Map();
    }

    /**
     * start loading packages, then resources
     */
    async startLoading() {
        console.log(this.packageSources);
        await this.loadPackages();
        console.log(this.resourceSources);
        await this.loadResources();
        console.log(this.resources);
    }

    /**
     * get a loaded resource
     * @param {string} pid 
     * @returns {any|undefined}
     */
    get(pid, id) {
        if (this.resources !== null)
            return this.resources.get(pid).get(id);
        else
            throw new Error(`accessing resources before loading finished`);
    }

    /**
     * get a package selector, for querying specific resources
     * @param {string} id 
     * @returns {function(rid:string):Resource}
     */
    getPackage(id) {
        if (this.resources.get(id) !== undefined)
            return rid => this.resources.get(id).get(rid);
        else
            throw new Error(`package ${id} does not exist`);
    }

    /**
     * add a new resource request to the queue
     * @param {string} pkgId
     * @param {string} resId 
     * @param {string} spec
     * @param {string} type 
     * @param {string} url
     */
    addResource(pkgId, resId, spec, type, url) {
        this.resourceSources.push({pkgId: pkgId, resId: resId, spec: spec, type: type, url: url});
    }
    
    /**
     * use package, loading in resource sources
     * @param {string} url 
     */
    addPackage(url) {
        if (!this.packageSources.includes(url))
            this.packageSources.push(url);
    }
    
    /**
     * download packages, adding resource sources
     * @private
     * @returns {Promise<Map<string, ResourceSource>>}
     */
    async loadPackages() {
        const packageRequests = this.packageSources
            .map(req => new JsonResourceLoader(req).load());

        for (const packageRequest of await Promise.all(packageRequests)) {
            const packageData = packageRequest.elem;
            for (const resource of packageData.resources) {
                this.addResource(
                    packageData.id,
                    resource.id,
                    resource.spec,
                    resource.type, 
                    resource.url
                );
            }
        }
        
        return this.resourceSources;
    }

    /**
     * download requested resources, returning a promise
     * 
     * @typedef {Object} ResourceSource
     * @property {string} url
     * @property {string} type
     * 
     * @private
     * @returns {Promise<Map<string, any>>}
     */
    async loadResources() {
        const resourceLoaders = this.resourceSources
            .map(req => new this.types[req.type](req.url, req.spec).load());

        // simple waiting, no progress
        // progress is tricky, currently no solution without complete rewrite
        // of basic data structures (maps are out)
        const resources = await Promise.all(resourceLoaders);

        this.resources = new Map();
        
        this.resourceSources.forEach((req, index) => {
            if (this.resources.has(req.pkgId)) {
                this.resources.get(req.pkgId).set(req.resId, resources[index]);
            } else {
                this.resources.set(req.pkgId, new Map([[req.resId, resources[index]]]));
            }
        });
        
        return this.resources;
    }

    /**
     * default types for resource manager
     * @private
     * @readonly
     * @enum {function(url:string):ResourceLoader}
     */
    static DefaultResourceRequestType = {
        image: ImageResourceLoader,
        audio: AudioBufferResourceLoader,
        text: TextResourceLoader,
        json: JsonResourceLoader,

        cubemap: CubemapResourceLoader,
    };
}

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */

class Controls {
    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     * @param {Camera} camera 
     */
    constructor(canvas, camera) {
        this.canvas = canvas;
        this.camera = camera;

        this.yaw = 0;
        this.pitch = 0;

        this.position = new Vector3();

        this.mouseMoveScale = 1;

        this.mouseLocked = false;

        this.keys = new Map();

        this.onMouseClick = this.handleClick.bind(this);
        this.onMouseMove = this.handleMove.bind(this);
        this.onLockedPointer = this.queryLock.bind(this);

        this.onKeyDown = this.handleKeyDown.bind(this);
        this.onKeyUp = this.handleKeyUp.bind(this);

        document.addEventListener("pointerlockchange", this.onLockedPointer);
    }

    /**
     * 
     * @param {MouseEvent} ev 
     */
    handleClick(ev) {
        if (!this.mouseLocked)
            this.lock();
    }

    /**
     * 
     * @param {MouseEvent} ev 
     */
    handleMove(ev) {
        if (this.mouseLocked)
            this.updateRotation([ev.movementX, ev.movementY]);
    }

    /**
     * 
     * @param {KeyboardEvent} ev 
     */
    handleKeyDown(ev) {
        console.log(ev.code);
        this.keys.set(ev.code, true);
    }

    /**
     * 
     * @param {KeyboardEvent} ev 
     */
    handleKeyUp(ev) {
        this.keys.set(ev.code, false);
    }

    updateMatrix() {
        const yawMatrix = new Matrix4().rotateY(this.yaw);
        const posMatrix = new Matrix4().setTranslation(this.position);

        this.camera.viewMatrix
            .setIdentity()
            .rotateX(this.pitch)
            .multiply(yawMatrix)
            .multiply(posMatrix);
    }

    updateRotation(mouseMovement) {
        this.yaw += mouseMovement[0] / Controls.DEG_SCALE;
        this.yaw %= Controls.DEGS;

        this.pitch += mouseMovement[1] / Controls.DEG_SCALE;
        this.pitch = Math.max(Math.min(this.pitch, Math.PI / 2), -Math.PI / 2);
    }

    updatePosition() {
        let moveSpeed = 1;

        if (this.keys.get("ShiftLeft") || this.keys.get("ShiftRight")) {
            moveSpeed = 2.6;
        }

        if (this.keys.get("KeyW")) {
            this.position[0] -= Math.sin(this.yaw) * moveSpeed;
            this.position[2] += Math.cos(this.yaw) * moveSpeed;
        }
        if (this.keys.get("KeyS")) {
            this.position[0] += Math.sin(this.yaw) * moveSpeed;
            this.position[2] -= Math.cos(this.yaw) * moveSpeed;
        }
        if (this.keys.get("KeyA")) {
            this.position[0] += Math.cos(this.yaw) * moveSpeed;
            this.position[2] += Math.sin(this.yaw) * moveSpeed;
        }
        if (this.keys.get("KeyD")) {
            this.position[0] -= Math.cos(this.yaw) * moveSpeed;
            this.position[2] -= Math.sin(this.yaw) * moveSpeed;
        }
    }

    update() {
        this.updatePosition();
        this.updateMatrix();
    }

    enable() {
        this.canvas.addEventListener('click', this.onMouseClick);
        this.canvas.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
    }

    disable() {
        document.exitPointerLock();
        this.canvas.removeEventListener('click', this.onMouseClick);
        this.canvas.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
    }

    lock() {
        this.canvas.requestPointerLock();
    }

    queryLock() {
        this.mouseLocked = document.pointerLockElement === this.canvas;
    }

    static DEG_SCALE = Math.PI * 90;
    static DEGS = Math.PI * 2;
}

class Level {
    /**
     * 
     * @param {Object} levelDescription 
     * @param {string} levelDescription.id
     * @param {string} levelDescription.pname
     * @param {Array<Array<number>>} levelDescription.spawns
     * @param {Array<Object>} levelDescription.geom
     */
    constructor(levelDescription) {
        this.id = levelDescription.id;
        this.pname = levelDescription.pname;
        this.spawns = levelDescription.spawns;
        this.geom = levelDescription.geom;
    }
}

/**
 * a generic mesh, to be specialized for certain tasks
 * @abstract
 */
class Mesh {
    /**
     * 
     * @param {Program} program 
     */
    constructor(program) {
        this.program = program;
        this.gl = program.gl;

        // define your properties here
    }

    /**
     * a default drawing function for non-indexed, triangle geometries
     * feel free to override with different draw function and parameters
     * @param {Camera} camera
     */
    draw(camera) {
        const drawCount = this.getDrawCount();
        this.program.use();
        this.bind(camera);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, drawCount);
    }

    /**
     * bind all inputs for a program
     * @abstract
     * @param {Camera} camera
     */
    bind(camera) {}

    /**
     * get a vertex count, specifing how much to draw
     * @abstract
     * @returns {number}
     */
    getDrawCount() {}

    /**
     * create a mesh from a description
     * @param {Object} meshDescription 
     */
    fromMeshDescription(meshDescription) {}
}

/**
 * a 2-component vector
 * @module Vector2
 * @typedef {Vector4|Vector3|Vector2} AnyVector
 */

class Vector2 extends Float32Array {
    /**
     * create a new 3-component vector
     * @constructs
     * @param {Vector2?} vector
     */
    constructor(vector=null) {
        super(2);

        if (vector !== null) {
            this.setFrom(vector);
        }
    }

    /**
     * set a vector components, one-by-one style
     * @param {number} x 
     * @param {number} y 
     * @returns {Vector2}
     */
    set(x, y) {
        this[0] = x;
        this[1] = y;

        return this;
    }

    /**
     * set from another vector
     * @param {AnyVector} vector 
     * @returns {Vector2}
     */
    setFrom(vector) {
        this[0] = vector[0];
        this[1] = vector[1];

        return this;
    }

    /**
     * add another vector
     * @param {AnyVector} vector 
     * @returns {Vector2}
     */
    add(vector) {
        this[0] += vector[0];
        this[1] += vector[1];

        return this;
    }

    /**
     * subtract another vector
     * @param {AnyVector} vector 
     * @returns {Vector2}
     */
    subtract(vector) {
        this[0] -= vector[0];
        this[1] -= vector[1];

        return this;
    }

    /**
     * multiply by another vector
     * @param {AnyVector} vector 
     * @returns {Vector2}
     */
    multiply(vector) {
        this[0] *= vector[0];
        this[1] *= vector[1];

        return this;
    }

    /**
     * scale this vector
     * @param {number} scale 
     * @returns {Vector2}
     */
    scale(scale) {
        this[0] *= scale;
        this[1] *= scale;

        return this;
    }

    /**
     * return a dot-product of two vectors
     * @param {Vector2} vectorA 
     * @param {Vector2} vectorB 
     * @returns {number}
     */
    static dot(vectorA, vectorB) {
        return (
            vectorA[0] * vectorB[0] +
            vectorA[1] * vectorB[1] +
            vectorA[2] * vectorB[2]
        );
    }
}

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */

class LevelBox {
    /**
     * 
     * @constructs
     * @param {Vector3} start 
     * @param {Vector3} end 
     * @param {Array<number>} tex
     */
    constructor(start, end, tex) {
        this.start = start;
        this.end = end;
        this.tex = tex;

        this.dimensions = new Vector3(end).subtract(start);

        const p = [start, end];

        const vertices = LevelBox.VERTICES_SCAFFOLD
            .map(([xs, ys, zs]) => new Vector3([p[xs][0], p[ys][1], p[zs][2]]));

        this.positionData = [];
        this.texCoordData = [];
        this.texTileData = [];
        this.indexData = [];
        
        for (let i = 0; i < 6; i++) {
            const axis = LevelBox.QUAD_AXIS[i];
            const face = LevelBox.QUAD_FACES[i];

            this.positionData[i] = this.getSidePositionArrayData(face, vertices);
            this.texCoordData[i] = this.getSideTexCoordArrayData(axis);
            this.texTileData[i] = this.getSideTexTileArrayData(i);
            this.indexData[i] = this.getSideIndices(i);
        }

        this.positionData = this.positionData.flat();
        this.texCoordData = this.texCoordData.flat();
        this.texTileData = this.texTileData.flat();
        this.indexData = this.indexData.flat();
    }

    getSideIndices(offset) {
        const absOffset = offset * 4;

        return LevelBox.QUAD_INDEX_SCAFFOLD.map(i => i + absOffset);
    }

    getSidePositionArrayData(indices, vertices) {
        return indices
            .map(i => vertices[i])
            .map(v => [...v])
            .flat();
    }

    getSideTexCoordArrayData(axis) {
        const texWidth = [...this.dimensions]
            .filter((_, i) => i != axis)
            .map(v => v / LevelBox.TEX_NOMINAL_SCALE);

        const texWidthNormalized = axis == 0 ? texWidth.reverse() : texWidth;

        console.log(texWidth);

        return LevelBox.QUAD_SCAFFOLD
            .map(qs => new Vector2(texWidthNormalized).multiply(qs))
            .map(v => [...v])
            .flat();
    }

    getSideTexTileArrayData(side) {
        console.log(this.tex
            .map(t => [t % 8, Math.floor(t / 8)])
            .map(tt => [tt, tt, tt, tt]));

        const tid = this.tex[side];
        const tt = [tid % 8, Math.floor(tid / 8)];

        return [tt, tt, tt, tt].flat();
    }

    static TEX_NOMINAL_SCALE = 32;

    static VERTICES_SCAFFOLD = [
        [0, 0, 1],
        [1, 0, 1],
        [0, 1, 1],
        [1, 1, 1],
        [1, 0, 0],
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 0]
    ];

    static QUAD_INDEX_SCAFFOLD = [
        0, 1, 2,
        3, 2, 1
    ];

    static QUAD_SCAFFOLD = [
        [0, 1],
        [1, 1],
        [0, 0],
        [1, 0],
    ];

    static QUAD_FACES = [
        [0, 1, 2, 3], // north
        [5, 0, 7, 2], // east
        [4, 5, 6, 7], // south
        [1, 4, 3, 6], // west
        [6, 7, 3, 2], // top
        [1, 0, 4, 5] // bottom
    ];

    static QUAD_AXIS = [
        2, // north
        0, // east
        2, // south
        0, // west
        1, // top
        1, // bottom
    ];
}

class LevelMesh extends Mesh {
    constructor(program, geomDescription, texture) {
        super(program);

        this.boxes = geomDescription.map(box => 
            new LevelBox(box.bbox.start, box.bbox.end, box.tex)
        );

        this.texture = texture;

        this.arrayBuffers = this.createArrayBuffers();
        this.elementArrayBuffer = this.createElementArrayBuffer();
    }

    createArrayBuffers() {
        const positionBufferData = new Float32Array(
            this.boxes
                .map(b => b.positionData)
                .flat()
        );

        const positionBuffer = new Buffer(
            this.gl,
            positionBufferData,
            this.gl.ARRAY_BUFFER,
            3,
            false
        );

        const texCoordBufferData = new Float32Array(
            this.boxes
                .map(b => b.texCoordData)
                .flat()
        );

        console.log("texCoord", texCoordBufferData);

        const texCoordBuffer = new Buffer(
            this.gl,
            texCoordBufferData,
            this.gl.ARRAY_BUFFER,
            2,
            false
        );

        const texTileBufferData = new Float32Array(
            this.boxes
                .map(b => b.texTileData)
                .flat()
        );

        console.log("texTile", texTileBufferData);

        const texTileBuffer = new Buffer(
            this.gl,
            texTileBufferData,
            this.gl.ARRAY_BUFFER,
            2,
            false
        );

        return new Map([
            ["aPosition", positionBuffer],
            ["aTexCoord", texCoordBuffer],
            ["aTexTile", texTileBuffer]
        ]);
    }

    createElementArrayBuffer() {
        const elementBufferData = new Uint16Array(
            this.boxes
                .map((b, i) => b.indexData.map(f => f + i * 24))
                .flat()
        );

        return new Buffer(
            this.gl, 
            elementBufferData, 
            this.gl.ELEMENT_ARRAY_BUFFER, 
            3, 
            false
        );
    }

    /**
     * 
     * @param {Camera} camera 
     */
    bind(camera) {
        for (const [location, buffer] of this.arrayBuffers) {
            this.program.bindArrayBuffer(location, buffer);
        }

        this.program.bindElementArrayBuffer(this.elementArrayBuffer);

        this.program.bindTexture("uTexture", 0, this.texture);

        this.program.bindMatrix4("uPVMatrix", camera.pvMatrix);
    }

    draw(camera) {
        const drawCount = this.getDrawCount();
        this.program.use();
        this.bind(camera);
        this.gl.drawElements(this.gl.TRIANGLES, drawCount, this.gl.UNSIGNED_SHORT, 0);
    }

    getDrawCount() {
        return this.elementArrayBuffer.size;
    }
}

/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('c');
const gl = canvas.getContext('webgl');

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
gl.viewport(0, 0, canvas.width, canvas.height);

const camera = new Camera(
    Math.PI / 3, 
    gl.canvas.width / gl.canvas.height, 
    1, 
    1024
);

const controls = new Controls(gl.canvas, camera);

window.addEventListener('resize', () => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    camera.aspect = canvas.width / canvas.height;
    camera.resize();
});

const resourceManager = new ResourceManager();

resourceManager.addPackage("./src/pkg/min.pkg.json");

resourceManager
    .startLoading()
    .then(() => { main(); });

function main() {
    const minTestRes = resourceManager.getPackage("testMin");



    console.log(
        minTestRes('wallShaderVert').elem, 
        minTestRes('wallShaderFrag').elem
    );

    const wallProgram = new Program(
        gl, 
        minTestRes('wallShaderVert').elem, 
        minTestRes('wallShaderFrag').elem, 
        ['aPosition', 'aTexTile', 'aTexCoord'], 
        ['uPVMatrix', 'uTexture']
    );

    const wall = {
        'pos': new Float32Array([ 
            -20, -20, 0, 
            20, -20, 0, 
            -20, 20, 0,
            -20, 20, 0, 
            20, -20, 0, 
            20, 20, 0
        ]),
        'tex': new Float32Array([
            0, 2, 
            2, 2,
            0, 0,
            0, 0,
            2, 2,
            2, 0
        ]),
        'tile': new Float32Array([
            4, 0,
            4, 0,
            4, 0,
            4, 0,
            4, 0,
            4, 0,
        ]),
    };

    const wallBuffers = {
        'pos': new Buffer(gl, wall.pos, gl.ARRAY_BUFFER, 3, false),
        'tex': new Buffer(gl, wall.tex, gl.ARRAY_BUFFER, 2, false),
        'tile': new Buffer(gl, wall.tile, gl.ARRAY_BUFFER, 2, false),
    };

    const wallTexture = new Texture2D(gl, minTestRes('mapTexDiffImg').elem, gl.RGB, gl.RGB);
    wallTexture.setFilters(gl.NEAREST_MIPMAP_LINEAR, gl.NEAREST);

    const level = new Level(minTestRes("map01").elem);
    console.log(level);
    const levelMesh = new LevelMesh(wallProgram, level.geom, wallTexture);
    console.log(levelMesh);

    // wallProgram.bindArrayBuffer('aPosition', wallBuffers['pos']);
    // wallProgram.bindArrayBuffer('aTexCoord', wallBuffers['tex']);
    // wallProgram.bindArrayBuffer('aTexTile', wallBuffers['tile']);

    console.log(camera);

    controls.position.set(0, -16, -160);

    // camera.viewMatrix.setTranslation(new Vector3().set(0, 0, -80)).rotateY(0.5);
    camera.update();

    console.log(gl.canvas.width / gl.canvas.height);

    // wallProgram.bindMatrix4('uPVMatrix', camera.pvMatrix);

    // wallProgram.bindTexture('uTexture', 0, wallTexture);

    const skyProgram = new Program(
        gl, 
        minTestRes('skyShaderVert').elem, 
        minTestRes('skyShaderFrag').elem,
        ['aPosition'],
        ['uPVMatrix', 'uSkyTexture']);

    const skyBuffers = {
        'pos': new Buffer(gl, screenSpaceGeometry, gl.ARRAY_BUFFER, 2, false)
    };

    console.log(minTestRes('skyTex').linkedElementsObject());

    const skyTexture = new TextureCubemap(gl, minTestRes('skyTex').linkedElementsObject(), gl.RGB, gl.RGB);
    skyTexture.setFilters(gl.NEAREST, gl.NEAREST);

    skyProgram.use();

    skyProgram.bindArrayBuffer('aPosition', skyBuffers['pos']);

    skyProgram.bindTexture('uSkyTexture', 7, skyTexture);

    skyProgram.bindMatrix4('uPVMatrix', camera.pvInvMatrix);

    console.log(wallProgram, wallBuffers, skyProgram, skyBuffers, gl.TEXTURE0, gl.TEXTURE1, gl.TEXTURE2);

    controls.enable();

    render();

    function render() {
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);

        gl.viewport(0, 0, canvas.width, canvas.height);

        // angle += 0.01;
        // viewMatrix.rotateY(angle);
        camera.update();

        // gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.depthFunc(gl.LESS);

        // wallProgram.use();

        // wallProgram.bindArrayBuffer('aPosition', wallBuffers['pos']);
        // wallProgram.bindArrayBuffer('aTexCoord', wallBuffers['tex']);
        // wallProgram.bindArrayBuffer('aTexTile', wallBuffers['tile']);

        // wallProgram.bindTexture('uTexture', 0, wallTexture);

        // wallProgram.bindMatrix4('uPVMatrix', camera.pvMatrix);

        // gl.drawArrays(gl.TRIANGLES, 0, 6);

        levelMesh.draw(camera);

        gl.depthFunc(gl.LEQUAL);

        skyProgram.use();

        skyProgram.bindArrayBuffer('aPosition', skyBuffers['pos']);

        skyProgram.bindTexture('uSkyTexture', 0, skyTexture);

        skyProgram.bindMatrix4('uPVMatrix', camera.pvInvMatrix);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        controls.update();

        requestAnimationFrame(render);
    }
}

const screenSpaceGeometry = new Float32Array([
    -1, -1,
    1, -1,
    -1, 1,
    -1, 1,
    1, -1,
    1, 1,
]);
