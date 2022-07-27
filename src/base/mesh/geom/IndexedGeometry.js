import Geometry from "./Geometry";
import Program from "../../../webgl/Program";
import Buffer from "../../../webgl/Buffer";

class IndexedGeometry extends Geometry {
    constructor(gl) {
        super(gl);
        this.indexBuffer = new Buffer(
            this.gl, 
            new Uint16Array(), 
            this.gl.ELEMENT_ARRAY_BUFFER, 
            3, 
            false
        );
    }

    /**
     * 
     * @param {Program} program 
     */
    bindToProgram(program) {
        super.bindToProgram(program);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    }
    
    setIndexBuffer(data) {
        this.indexBuffer.setBuffer(data);
    }

    getCount() {
        return this.indexBuffer.size;
    }

    draw() {
        this.gl.drawElements(this.gl.TRIANGLES, this.drawCount, this.gl.SHORT, 0);
    }
}

export default IndexedGeometry;