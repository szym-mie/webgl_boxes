import Program from "../../webgl/Program";
import Buffer from "../../webgl/Buffer";
import Camera from "../Camera";
import GeometryArray from "./GeometryArray";
import GLContextObject from "../../webgl/GLContextObject";
import Resource from "../resource/Resource";
import MeshInfo from "./MeshInfo";
import Texture2D from "../../webgl/Texture2D";
import TextureCubemap from "../../webgl/TextureCubemap";

/**
 * a generic mesh, specify how to count number of vertices, and what to be
 * bound outside of arrays, camera matrices and textures
 * 
 * for a mesh with indexed geometry
 * @see {@link MeshIndexed}
 * 
 * @abstract
 */
class Mesh extends GLContextObject {
    /**
     * 
     * @constructs
     * @param {Program} program 
     * @param {Map<string, GeometryArray>} [geometryArrayMap]
     * @param {Map<string, Texture2D|TextureCubemap} [textures]
     */
    constructor(program, geometryArrayMap, textures) {
        super(program.gl);
        this.program = program;

        /**
         * @type {Map<string, Texture2D|TextureCubemap>}
         */
        this.textures = textures || new Map();
        if (geometryArrayMap !== undefined) {
            this.arrayBufferMap = this.createBufferMap(geometryArrayMap);
        } else {
            this.arrayBufferMap = null;
        }

        // define your own properties here
    }

    /**
     * get a map of buffers, made from geometry arrays
     * @param {Map<string, GeometryArray>} geometryArrayMap 
     * @returns {Map<string, Buffer>}
     */
    createBufferMap(geometryArrayMap) {
        const bufferMap = new Map();

        for (const [name, geometryArray] of geometryArrayMap) {
            console.log("attrib name", name, geometryArray, geometryArray.components);
            bufferMap.set(name, this.createBuffer(geometryArray, this.gl.ARRAY_BUFFER));
        }

        return bufferMap;
    }

    /**
     * create a buffer from a geometry array
     * @param {GeometryArray} geometryArray 
     * @param {GLenum} bufferType
     * @returns {Buffer}
     */
    createBuffer(geometryArray, bufferType) {
        return new Buffer(
            this.gl,
            bufferType,
            geometryArray.array,
            geometryArray.arrayType,
            geometryArray.components,
            false
        );
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
     * @param {Camera} camera
     */
    bind(camera) {
        this.bindArrays();
        this.bindCamera(camera);
        this.bindTextures();
        this.bindOther(camera);
    }

    /**
     * bind arrays
     */
    bindArrays() {
        for (const [location, buffer] of this.arrayBufferMap) {
            this.program.bindArrayBuffer(location, buffer);
        }
    }

    /**
     * bind other uniforms
     * @abstract
     */
    bindOther() {
        throw new Error("method not implemented");
    }

    /**
     * bind camera uniforms
     * @param {Camera} camera
     */
    bindCamera(camera) {
        this.program.bindMatrix4(Mesh.CAMERA_PV_MATRIX_LOCATION, camera.pvMatrix);
    }

    /**
     * bind texture uniforms
     */
    bindTextures() {
        let currentUnit = 0;
        for (const [location, texture] of this.textures) {
            this.program.bindTexture(location, currentUnit++, texture);
        }
    }

    /**
     * get a vertex count, specifing how much to draw
     * @abstract
     * @returns {number}
     */
    getDrawCount() {
        throw new Error("method not implemented");
    }

    /**
     * create a mesh based on a resource - mesh info and linked resources
     * @param {string} meshName
     * @param {Resource} resource
     */
    setFromMeshInfo(meshName, resource) {
        /**
         * @type {MeshInfo}
         */
        const meshInfo = resource.elem.meshInfoMap.get(meshName);

        console.log("meshinfo", meshInfo);

        const geometryArrayMap = meshInfo.getGeometryArrayMap(meshName, resource);
        this.arrayBufferMap = this.createBufferMap(geometryArrayMap);

        console.log("geometry", geometryArrayMap);

        for (const [location, textureInfo] of meshInfo.material) {
            /**
             * @type {Texture2D}
             */
            const texture = new Texture2D(
                this.gl, 
                resource.getLinked(location).elem,
                this.gl.RGB,
                this.gl.RGB
            );

            texture.setFilters(
                textureInfo.minFilter || this.gl.LINEAR,
                textureInfo.magFilter || this.gl.LINEAR
            );

            this.textures.set(location, texture);
        }
    }

    static CAMERA_PV_MATRIX_LOCATION = "pv_matrix";
    static CAMERA_PV_INV_MATRIX_LOCATION = "pv_inv_matrix";
}

export default Mesh;

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */
