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

export default Vector4;

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */
