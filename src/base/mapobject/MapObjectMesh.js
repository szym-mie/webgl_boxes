import Matrix4 from "../../webgl/Matrix4";
import Vector3 from "../../webgl/Vector3";
import Camera from "../Camera";
import Mesh from "../mesh/Mesh";

class MapObjectMesh extends Mesh {
    constructor(program, meshDescription, diffTexture) {
        super(program);

        this.meshDescription = meshDescription;
        this.diffTexture = diffTexture;

        this.arrayComponentMap = new Map([
            ["aPosition", 3],
            ["aNormal", 3],
            ["aTexCoord", 2]
        ]);

        this.arrayBuffers = this.createArrayBuffers(this.getArrayData());

        this.position = new Vector3([-32, 0, 154]);

        this.modelMatrix = new Matrix4();
        this.modelMatrix.setFromAxisAngle(new Vector3([1, 0, 0]), Math.PI / 2);

        this.update();
    }

    getArrayData() {
        const body = this.meshDescription.get("body");
        const geometry = body.geometry;

        const arrayData = new Map();

        console.log(new Float32Array(geometry.get("NORMAL").array));

        arrayData.set("aPosition", new Float32Array(geometry.get("VERTEX").array));
        arrayData.set("aNormal", new Float32Array(geometry.get("NORMAL").array));
        arrayData.set("aTexCoord", new Float32Array(geometry.get("TEXCOORD").array));

        return arrayData;
    }

    update() {
        this.modelMatrix
            .setTranslation(this.position);
    }

    /**
     * 
     * @param {Camera} camera 
     */
    bind(camera) {
        for (const [location, buffer] of this.arrayBuffers) {
            this.program.bindArrayBuffer(location, buffer);
        }

        this.program.bindTexture("uDiffTexture", 0, this.diffTexture);

        this.program.bindMatrix4("uPVMatrix", camera.pvMatrix);
        this.program.bindMatrix4("uModelMatrix", this.modelMatrix);
    }

    getDrawCount() {
        return 3030;
    }
}

export default MapObjectMesh;