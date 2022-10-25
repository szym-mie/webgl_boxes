/**
 * basic operation on 4x4 matrices
 * @module Matrix4
 */

import Vector4 from "./Vector4";

class Matrix4 extends Float32Array {
    /**
     * creates a new instance of matrix4
     * @constructor
     * @param {Matrix4} [matrix] matrix to copy from
     */
    constructor(matrix) {
        super(16);

        if (matrix !== undefined) {
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
     * simply add two matrices
     * @param {Matrix4} matrix other matrix
     * @return {Matrix4} this matrix
     */
    add(matrix) {
        this[0] += matrix[0];
        this[1] += matrix[1];
        this[2] += matrix[2];
        this[3] += matrix[3];
        this[4] += matrix[4];
        this[5] += matrix[5];
        this[6] += matrix[6];
        this[7] += matrix[7];
        this[8] += matrix[8];
        this[9] += matrix[9];
        this[10] += matrix[10];
        this[11] += matrix[11];
        this[12] += matrix[12];
        this[13] += matrix[13];
        this[14] += matrix[14];
        this[15] += matrix[15];

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
     * get a mix of two matrices
     * @param {Matrix4} matrix0 
     * @param {Matrix4} matrix1 
     * @param {number} weight0 
     * @param {number} weight1 
     * @returns {Matrix4}
     */
    static getMix(matrix0, matrix1, weight0, weight1) {
        const sMatrixA = new Matrix4(matrix0).scale(weight0);
        const sMatrixB = new Matrix4(matrix1).scale(weight1);

        return sMatrixA.add(sMatrixB);
    }

    /**
     * get a lerp of two matrices
     * @param {Matrix4} matrix0 
     * @param {Matrix4} matrix1
     * @param {number} weight 
     * @returns {Matrix4}
     */
    static getLerp(matrix0, matrix1, weight) {
        return this.getMix(matrix0, matrix1, 1 - weight, weight);
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

export default Matrix4;

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */
