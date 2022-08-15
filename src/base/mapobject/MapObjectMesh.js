import Program from "../../webgl/Program";
import Resource from "../resource/Resource";
import MeshIndexed from "../mesh/MeshIndexed";
import Matrix4 from "../../webgl/Matrix4";
import Vector3 from "../../webgl/Vector3";

class MapObjectMesh extends MeshIndexed {
    /**
     * 
     * @param {Program} program 
     * @param {string} meshName 
     * @param {Resource} resource 
     */
    constructor(program, meshName, resource) {
        super(program);
        this.setFromMeshInfo(meshName, resource);

        this.modelMatrix = new Matrix4();
        this.position = new Vector3();
    }

    /**
     * update a model matrix,
     * called implicitly by bindOther.
     */
    update() {
        this.modelMatrix
            .setTranslation(this.position);
    }

    /**
     * bind other user-defined uniforms
     */
    bindOther() {
        this.update();

        this.program.bindMatrix4("model_matrix", this.modelMatrix);
    }
}

export default MapObjectMesh;

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */
