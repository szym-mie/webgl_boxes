/**
 * a unified mesh building methods
 * @module MeshDescription
 */

/**
 * info about material
 * @typedef {Map<string, EffectInfo>} MaterialInfo
 */

/**
 * info about particular effect (mostly image data)
 * @typedef {Object} EffectInfo
 * @property {string} imageUrl
 */

/**
 * assembled geometry data suitable for putting into a buffer
 * @typedef {Object} GeometryInfo
 * @property {Array<number>} array
 * @property {number} components
 * @property {number} size
 * @property {number} packedOffset
 */

/**
 * processed info about mesh
 * @typedef {Object} MeshNodeInfo
 * @property {Array<number>} matrix
 * @property {Map<string, GeometryInfo>} geometry
 * @property {MaterialInfo} material
 * @property {Array<number>} childrenIds
 * 
 */

/**
 * raw info about scene node
 * @typedef {Object} NodeInfo
 * @property {string} name
 * @property {Array<number>} matrix
 * @property {string} geometryTarget
 * @property {string} materialTarget
 * @property {Array<number>} childrenIds
 */

/**
 * @deprecated use {@link MeshInfo}
 */
class MeshDescription {
    /**
     * made for COLLADA
     * @param {Array<MeshNodeInfo>} meshInfos
     */
    constructor(meshInfos) {
        this.meshInfos = meshInfos;
    }
}

export default MeshDescription;

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */
