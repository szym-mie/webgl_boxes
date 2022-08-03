import Program from "../../webgl/Program";
import Buffer from "../../webgl/Buffer";
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

        // FIXME
        // FIXME
        // FIXME
        // dirty hack dont fucking do this ever again
        this.arrayComponentMap = new Map();

        // define your properties here
    }

    /**
     * 
     * @param {Map<string, Float32Array>} arrayMap 
     */
    createArrayBuffers(arrayMap) {
        const bufferMap = new Map();

        for (const [name, array] of arrayMap) {
            const components = this.arrayComponentMap.get(name);
            console.log("attrib name", name, array, components);

            const buffer = new Buffer(
                this.gl, 
                array, 
                this.gl.ARRAY_BUFFER,
                components,
                false
            );
            bufferMap.set(name, buffer);
        }

        return bufferMap;
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

    static ARRAY_COMPONENT_MAP = new Map();
}

export default Mesh;