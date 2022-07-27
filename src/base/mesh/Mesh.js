import Program from "../../webgl/Program";
import Camera from "../Camera";

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

export default Mesh;