import Program from "../../webgl/Program";
import Texture2D from "../../webgl/Texture2D";
import TextureCubemap from "../../webgl/TextureCubemap";
import GeometryArray from "./GeometryArray";
import Mesh from "./Mesh";
import MeshInfo from "./MeshInfo";

/**
 * a variation of a mesh with an element array for a indexed drawing
 */
class MeshIndexed extends Mesh {
    /**
     * 
     * @param {Program} program 
     * @param {Map<string, GeometryArray>} [geometryArrayMap] 
     * @param {GeometryArray} [indexArray] 
     * @param {Map<string, Texture2D|TextureCubemap} [textures]
     */
    constructor(program, geometryArrayMap, indexArray, textures) {
        super(program, geometryArrayMap, textures);
        if (indexArray !== undefined) {
            this.elementArrayBuffer = this.createBuffer(indexArray, this.gl.ELEMENT_ARRAY_BUFFER);
        } else {
            this.elementArrayBuffer = null;
        }

        // define your own properties here
    }

    draw(camera) {
        const drawCount = this.getDrawCount();
        this.program.use();
        this.bind(camera);
        this.gl.drawElements(this.gl.TRIANGLES, drawCount, this.gl.UNSIGNED_SHORT, 0);
    }

    /**
     * bind all arrays + element array
     */
    bindArrays() {
        super.bindArrays();
        this.program.bindElementArrayBuffer(this.elementArrayBuffer);
    }

    /**
     * get an amount of vertices to draw
     * @returns {number}
     */
    getDrawCount() {
        return this.elementArrayBuffer.size;
    }

    /**
     * create a mesh based on a resource - mesh info and linked resources
     * @param {string} meshName
     * @param {Resource} resource
     */
    setFromMeshInfo(meshName, resource) {
        super.setFromMeshInfo(meshName, resource);

        /**
         * @type {MeshInfo}
         */
        const meshInfo = resource.elem.meshInfoMap.get(meshName);

        const elementGeometryArrayMap = meshInfo.getIndexGeometryArray(meshName, resource);
        this.elementArrayBuffer = this.createBuffer(elementGeometryArrayMap, this.gl.ELEMENT_ARRAY_BUFFER);
    }
}

export default MeshIndexed;

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */
