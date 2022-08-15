import GeometryArray from "./GeometryArray";

/**
 * a typed array for use with buffers
 * @typedef {Uint8Array|Uint16Array|Uint32Array|Float32Array} TypedArray 
 * @typedef {function(array:Array<number>|ArrayBuffer):TypedArray} TypedArrayConstructor
 */

/**
 * @typedef {Map<string, ImageInfo>} MaterialInfo
 */

/**
 * @typedef {Object} ImageInfo
 * @prop {string} name
 * @prop {string} uri
 * @prop {number} [magFilter]
 * @prop {number} [minFilter]
 * @prop {number} [wrapS]
 * @prop {number} [wrapT]
 */

/**
 * @typedef {Object} ArrayInfo
 * @prop {number} bufferId
 * @prop {number} byteLength
 * @prop {number} byteOffset
 * @prop {number} componentType
 * @prop {number} components
 * @prop {number} size
 */

/**
 * @typedef {Object} BufferSource
 * @prop {string} uri
 * @prop {number} [byteLength]
 */

class MeshInfo {
    /**
     * 
     * @constructs
     * @param {MaterialInfo} material 
     * @param {Map<string, ArrayInfo>} arrays 
     * @param {ArrayInfo} indexArray 
     * @param {Array<BufferSource>} [bufferSources] 
     */
    constructor(material, arrays, indexArray, bufferSources) {
        this.material = material;
        this.arrays = arrays;
        this.indexArray = indexArray;
        this.bufferSources = bufferSources;
    }

    /**
     * 
     * @param {string} meshName
     * @param {Resource} meshResource 
     * @returns {Map<string, GeometryArray>} a map of geometry arrays
     */
    getGeometryArrayMap(meshName, meshResource) {
        const geometryArrayMap = new Map();

        for (const [arrayName, arrayInfo] of this.arrays) {
            const arrayBufferResourceName = meshName + '_' + arrayInfo.bufferId;
            const geometryArray = this.getGeometryArray(
                arrayInfo, 
                meshResource.getLinked(arrayBufferResourceName).elem
            );

            geometryArrayMap.set(arrayName, geometryArray);
        }

        return geometryArrayMap;
    }

    /**
     * 
     * @param {string} meshName
     * @param {Resource} meshResource 
     * @returns {GeometryArray}
     */
    getIndexGeometryArray(meshName, meshResource) {
        const arrayBufferResourceName = meshName + '_' + this.indexArray.bufferId;
        return this.getGeometryArray(
            this.indexArray,
            meshResource.getLinked(arrayBufferResourceName).elem
        );
    }

    /**
     * 
     * @private
     * @param {ArrayInfo} arrayInfo 
     * @param {ArrayBuffer} dataBuffer 
     * @returns 
     */
    getGeometryArray(arrayInfo, dataBuffer) {
        const byteStart = arrayInfo.byteOffset;
        const byteEnd = arrayInfo.byteOffset + arrayInfo.byteLength;

        const bufferSlice = dataBuffer.slice(byteStart, byteEnd);
        console.log(new Float32Array(bufferSlice), new Uint16Array(bufferSlice));

        return new GeometryArray(
            bufferSlice, 
            arrayInfo.components,
            arrayInfo.componentType,
        );
    }
}

export default MeshInfo;

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */
