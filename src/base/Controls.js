import Matrix4 from "../webgl/Matrix4";
import Vector3 from "../webgl/Vector3";
import Camera from "./Camera";

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

export default Controls;

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */
