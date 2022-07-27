import Mesh from "../mesh/Mesh";
import LevelBox from "./LevelBox";
import Buffer from "../../webgl/Buffer";

class LevelMesh extends Mesh {
    constructor(program, geomDescription, texture) {
        super(program);

        this.boxes = geomDescription.map(box => 
            new LevelBox(box.bbox.start, box.bbox.end, box.tex)
        );

        this.texture = texture;

        this.arrayBuffers = this.createArrayBuffers();
        this.elementArrayBuffer = this.createElementArrayBuffer();
    }

    createArrayBuffers() {
        const positionBufferData = new Float32Array(
            this.boxes
                .map(b => b.positionData)
                .flat()
        );

        const positionBuffer = new Buffer(
            this.gl,
            positionBufferData,
            this.gl.ARRAY_BUFFER,
            3,
            false
        );

        const texCoordBufferData = new Float32Array(
            this.boxes
                .map(b => b.texCoordData)
                .flat()
        );

        console.log("texCoord", texCoordBufferData);

        const texCoordBuffer = new Buffer(
            this.gl,
            texCoordBufferData,
            this.gl.ARRAY_BUFFER,
            2,
            false
        );

        const texTileBufferData = new Float32Array(
            this.boxes
                .map(b => b.texTileData)
                .flat()
        );

        console.log("texTile", texTileBufferData);

        const texTileBuffer = new Buffer(
            this.gl,
            texTileBufferData,
            this.gl.ARRAY_BUFFER,
            2,
            false
        );

        return new Map([
            ["aPosition", positionBuffer],
            ["aTexCoord", texCoordBuffer],
            ["aTexTile", texTileBuffer]
        ]);
    }

    createElementArrayBuffer() {
        const elementBufferData = new Uint16Array(
            this.boxes
                .map((b, i) => b.indexData.map(f => f + i * 24))
                .flat()
        );

        return new Buffer(
            this.gl, 
            elementBufferData, 
            this.gl.ELEMENT_ARRAY_BUFFER, 
            3, 
            false
        );
    }

    /**
     * 
     * @param {Camera} camera 
     */
    bind(camera) {
        for (const [location, buffer] of this.arrayBuffers) {
            this.program.bindArrayBuffer(location, buffer);
        }

        this.program.bindElementArrayBuffer(this.elementArrayBuffer);

        this.program.bindTexture("uTexture", 0, this.texture);

        this.program.bindMatrix4("uPVMatrix", camera.pvMatrix);
    }

    draw(camera) {
        const drawCount = this.getDrawCount();
        this.program.use();
        this.bind(camera);
        this.gl.drawElements(this.gl.TRIANGLES, drawCount, this.gl.UNSIGNED_SHORT, 0);
    }

    getDrawCount() {
        return this.elementArrayBuffer.size;
    }
}

export default LevelMesh;