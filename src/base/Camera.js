/**
 * a perspective camera, complete with matrices
 * @module Camera
 */

import Matrix4 from "../webgl/Matrix4";
import Vector3 from "../webgl/Vector3";

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

        this.position = new Vector3();

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

export default Camera;

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */
