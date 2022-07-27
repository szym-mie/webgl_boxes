import Geometry from "./Geometry";

class PointGeometry extends Geometry {
    constructor(gl) {
        super(gl);
    }

    draw() {
        this.gl.drawArrays(this.gl.POINTS, 0, this.drawCount);
    }
}

export default PointGeometry;