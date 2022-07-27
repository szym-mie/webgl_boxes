import Program from "../../../webgl/Program";
import Buffer from "../../../webgl/Buffer";
import GLContextObject from "../../../webgl/GLContextObject";

class Geometry extends GLContextObject {
    constructor(gl) {
        super(gl);
        this.arrayBuffers = new Map();

        this.drawCount = 0;
    }

    /**
     * 
     * @param {Program} program 
     */
    bindToProgram(program) {
        for (const [location, buffer] of this.arrayBuffers) {
            program.bindArrayBuffer(location, buffer, 0, 0);
        }
    }

    addArrayBuffer(location, data, components) {
        const buffer = new Buffer(
            this.gl, 
            new Float32Array(data), 
            this.gl.ARRAY_BUFFER,
            components,
            false
        );
        this.arrayBuffers.set(location, buffer);
        this.drawCount = this.getCount();
    }

    setArrayBuffer(location, data) {
        this.arrayBuffers.get(location).setBuffer(data);
        this.drawCount = this.getCount();
    }

    getCount() {
        return Math.min(...[...this.arrayBuffers.values()].map(b => b.size));
    }

    draw() {
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.drawCount);
    }
}

export default Geometry;