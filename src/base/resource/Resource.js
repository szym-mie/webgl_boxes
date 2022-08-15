/**
 * @module Resource
 */

class Resource {
    /**
     * create a new resource
     * @constructs
     * @param {any} element 
     */
    constructor(element) {
        this.elem = element;
        /**
         * @type {Map<string, Resource>}
         */
        this.linked = new Map();
    }

    /**
     * return a linked resource by id
     * @param {string} id 
     * @returns {Resource}
     */
    getLinked(id) {
        return this.linked.get(id);
    }

    /**
     * return linked resource elements
     * @returns {Map<string, any>}
     */
    linkedElements() {
        return new Map([...this.linked.entries()].map(([k, v]) => [k, v.elem]));
    }

    /**
     * take a linked elements map, and convert to object
     * @returns {Object}
     */
    linkedElementsObject() {
        return Object.fromEntries(this.linkedElements());
    }
}

export default Resource;

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */
