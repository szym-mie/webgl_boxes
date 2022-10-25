import Vector4 from "./Vector4";
import Matrix4 from "./Matrix4";

class Quaternion extends Vector4 {
    /**
     * create a quaternion
     * @constructs
     * @param {number} a 
     * @param {number} b 
     * @param {number} c 
     * @param {number} d 
     */
    constructor(a, b, c, d) {
        super();

        this.set(a, b, c, d);
    }

    /**
     * return a conjugate of this quaternion
     * @returns {Quaternion} this quaternion
     */
    conjugate() {
        this[1] *= -1;
        this[2] *= -1;
        this[3] *= -1;

        return this;
    }

    /**
     * inverse this quaternion
     * @returns {Quaternion} this quaternion
     */
    invert() {
        const modulusSquared = this.lengthSquared();

        if (modulusSquared !== 0) {
            this.conjugate().scale(1 / modulusSquared);
        }

        return this;
    }

    toMatrix4() {
        const a = this[0], b = this[1], c = this[2], d = this[3];

        const m = new Matrix4();
        m[0] = a;
        m[1] = b;
        m[2] = c;
        m[3] = d;
        m[4] = -b;
        m[5] = a;
        m[6] = d;
        m[7] = -c;
        m[8] = -c;
        m[9] = d;
        m[10] = a;
        m[11] = b;
        m[12] = -d;
        m[13] = c;
        m[14] = -b;
        m[15] = a;

        return m;
    }

    /**
     * set from axis angle
     * @returns {Quaternion} this quaternion
     */
    setFromAxisAngle() {

    }

    /**
     * transform a vector by this quaternion
     * @param {Vector3} vector vector to transform
     * @returns {Quaternion} this quaternion
     */
    transformVector3(vector) {


        return this;
    }
}

export default Quaternion;