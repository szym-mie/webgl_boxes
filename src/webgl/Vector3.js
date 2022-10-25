/**
 * a 3-component vector
 * @module Vector3
 * @typedef {Vector4|Vector3|Vector2} AnyVector
 */

class Vector3 extends Float32Array {
    /**
     * create a new 3-component vector
     * @constructs
     * @param {Vector3} [vector]
     */
    constructor(vector) {
        super(3);

        if (vector !== undefined) {
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
     * get a length of this vector
     * @returns {number} vector length
     */
    length() {
        return Math.sqrt(this.lengthSquared());
    }

    /**
     * get a squared length of this vector
     * @returns {number} vector length
     */
    lengthSquared() {
        return this[0]**2 + this[1]**2 + this[2]**2 + this[3]**2;
    }

    /**
     * normalize this vector
     * @returns {Vector3} this vector
     */
    normalize() {
        const length = this.length();

        if (length !== 0) {
            this.scale(1 / length);
        }

        return this;
    }
    
    /**
     * return a dot-product of two vectors
     * @param {Vector3} vectorA 
     * @param {Vector3} vectorB 
     * @returns {number} dot product
     */
    static dot(vectorA, vectorB) {
        return (
            vectorA[0] * vectorB[0] +
            vectorA[1] * vectorB[1] +
            vectorA[2] * vectorB[2]
        );
    }
}

export default Vector3;

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */
