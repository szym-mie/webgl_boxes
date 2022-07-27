/**
 * small COLLADA model info
 * @module ColladaRawModel
 */

import ResourceManager from "./res/ResourceManager";

/**
 * info about material (effectInfo for now)
 * @typedef {EffectInfo} MaterialInfo
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
 * @typedef {Object} MeshInfo
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

class ColladaRawModel {
    /**
     * construct a new model info
     * @constructs
     * @param {string} model
     */
    constructor(model) {
        /**
         * @type {XMLDocument}
         */
        this.xml = ColladaRawModel.domParser.parseFromString(model, "text/xml");

        if (this.xml.documentElement.nodeName !== "COLLADA") {
            throw new TypeError("Not a COLLADA model");
        }

        this.meshesInfo = this.getMeshes();
    }

    /**
     * get a geometry by a target and build it
     * @private
     * @param {string} target 
     * @returns {Map<string, GeometryInfo>}
     */
    getGeometry(target) {
        const geometryNode = this.xml.querySelector(target);

        const packedGeometryBuffers = {};

        const triangleInputs = [...geometryNode.querySelectorAll("mesh > triangles > input")];
        const trianglePrimitives = geometryNode.querySelector("mesh > triangle > p");
        const trianglePrimitivesArray = ColladaRawModel.parseIntArray(trianglePrimitives.textContent);

        for (const input of triangleInputs) {
            const bufferName = input.getAttribute("semantic");
            const bufferOffset = parseInt(input.getAttribute("offset"));

            const bufferSource = this.traverseByQuery(
                input.getAttribute("source"),
                elem => elem.querySelector("input").getAttribute("source"),
                ColladaRawModel.isTagName("source")
            );

            const bufferAccessesor = bufferSource.querySelector("accessor");
            const components = parseInt(bufferAccessesor.getAttribute("stride") || 1);
            const size = parseInt(bufferAccessesor.getAttribute("count"));

            const stringArray = this.traverseByQuery(
                bufferAccessesor.getAttribute("source"),
                elem => elem.getAttribute("source"),
                ColladaRawModel.isTagName("float_array")
            ).textContent;

            const array = ColladaRawModel.parseFloatArray(stringArray);

            packedGeometryBuffers[bufferName] = {
                array: array,
                components: components,
                size: size,
                packedOffset: bufferOffset,
            };
        }

        return this.buildGeometry(packedGeometryBuffers, trianglePrimitivesArray);
    }

    /**
     * build geometry using indices from primitive array
     * @private
     * @param {Map<string, GeometryInfo>} inputBufferMap all the raw vertices
     * @param {Array<number>} primitiveArray a array of indices
     * @returns {Map<string, GeometryInfo>} assembled geometry
     */
    buildGeometry(inputBufferMap, primitiveArray) {
        const bufferCount = inputBufferMap.size;
        const offsetToNameTranslation = [];

        for (const [inputName, inputBuffer] of inputBufferMap) {
            offsetToNameTranslation[inputBuffer.packedOffset] = inputName;
        }

        /**
         * @type {Map<string, GeometryInfo>}
         */
        const bufferMap = new Map();

        for (const [inputName, inputBuffer] of inputBufferMap) {
            bufferMap.set(
                inputName, 
                {
                    array: [],
                    components: inputBuffer.components,
                    size: 0,
                    packedOffset: inputBuffer.packedOffset,
                }
            );
        }

        for (let i = 0; i < primitiveArray.length; i++) {
            const offset = i % bufferCount;
            const bufferName = offsetToNameTranslation[offset];

            const inputBuffer = inputBufferMap.get(bufferName);
            const outputBuffer = bufferMap.get(bufferName);

            const index = primitiveArray[i];

            outputBuffer.array.push(inputBuffer.array[index]);
            outputBuffer.size++;
        }

        return bufferMap;
    }

    /**
     * get material info (basically effect info)
     * @private
     * @param {string} target 
     * @returns {MaterialInfo}
     */
    getMaterial(target) {
        const materialNode = this.xml.querySelector(target);

        const effectTarget = materialNode
            .querySelector("instance_effect")
            .getAttribute("url");

        return this.getEffect(effectTarget);
    }

    /**
     * aqcuire info about an effect of a material
     * @private
     * @param {string} target 
     * @returns {Map<string, EffectInfo>}
     */
    getEffect(target) {
        const effectNode = this.xml.querySelector(target);

        return new Map(
            [...effectNode.querySelectorAll("surface[type='2D'] > init_from")]
                .map(node => node.textContent)
                .map(surfaceTarget => [
                    surfaceTarget, 
                    {
                        imageUrl: this.getImageUrl(surfaceTarget),
                    }
                ])
        );
    }

    /**
     * find a relative file name of image resource
     * @private
     * @param {string} target 
     * @returns {string}
     */
    getImageUrl(target) {
        return document.getElementById(target).querySelector("init_from").textContent;
    }

    /**
     * build a object of mesh info
     * @private
     * @returns {Map<string, MeshInfo>}
     */
    getMeshes() {
        return new Map(
            [...this.xml.querySelectorAll("node[type='NODE']")]
                .map(this.getNodeInfo)
                .map(nodeInfo => [
                    nodeInfo.name, 
                    {
                        matrix: nodeInfo.matrix,
                        geometry: this.getGeometry(nodeInfo.geometryTarget),
                        material: this.getMaterial(nodeInfo.materialTarget),
                        childrenIds: nodeInfo.childrenIds,
                    }
                ])
        );
    }

    /**
     * find a parent of this node
     * @private
     * @param {Element} node
     * @returns {Array<Element>}
     */
    getChildrenNodes(node) {
        return [...node.querySelectorAll("node[type='NODE'")]
    }

    /**
     * get info about a node (object in a scene)
     * @private
     * @param {Element} node 
     * @returns {NodeInfo}
     */
    getNodeInfo(node) {
        const matrixNode = node.querySelector("matrix[sid='transform']");
        const geometryNode = node.querySelector("instance_geometry");
        const materialNode = node.querySelector("instance_material");

        return {
            name: node.id,
            matrix: ColladaRawModel.parseFloatArray(matrixNode.textContent),
            geometryTarget: geometryNode.getAttribute("url"),
            materialTarget: materialNode.getAttribute("target"),
            childrenIds: this.getChildrenNodes(node).map(node => node.id),
        };
    }

    /**
     * return all model texture urls
     * @returns {Array<string>}
     */
    getTextureUrls() {
        return [...this.meshesInfo.values()]
            .map(meshInfo => meshInfo.material.imageUrl);
    }

    /**
     * traverse thru the document, testing a current element and selecting the
     * next point of travel, stopping on predicate success, or no element
     * @private
     * @param {string} id
     * @param {function(elem:Element):string} findNextId
     * @param {function(elem:Element):boolean} foundPredicate
     * @returns {Element|null}
     */
    traverseByQuery(id, findNextId, foundPredicate) {
        const refElem = this.xml.querySelector(id);

        return foundPredicate(refElem) ? 
            refElem : 
            this.traverseByQuery(findNextId(refElem), findNextId, foundPredicate);
    }

    /**
     * return a predicate, testing tag name of a given element
     * @private
     * @param {string} tagName 
     * @returns {function(elem:Element):boolean}
     */
    static isTagName(tagName) {
        return (elem => elem.nodeName === tagName);
    }

    /**
     * parse a space separated array of floats
     * @private
     * @param {string} arrayString 
     * @returns {Array<number>}
     */
    static parseFloatArray(arrayString) {
        return arrayString
            .split(' ')
            .map(parseFloat);
    }

    /**
     * parse a space separated array of ints
     * @private
     * @param {string} arrayString 
     * @returns {Array<number>}
     */
     static parseIntArray(arrayString) {
        return arrayString
            .split(' ')
            .map(parseInt);
    }

    static domParser = new DOMParser();
}

export default ColladaRawModel;

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */
