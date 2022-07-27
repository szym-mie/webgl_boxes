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

export default Vector2;

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */
