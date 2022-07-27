/**
 * @module ResourceLoader
 */

import Resource from "./Resource";

/**
 * @abstract
 */
class ResourceLoader {
    /**
     * create a new resource loader for a given URL
     * @param {string|Object|Array<string>} url 
     * @param {Object} spec
     */
    constructor(url, spec={}) {
        this.url = url;
        this.spec = spec;
    }

    /**
     * load a primary resource, along with referenced ones
     * @returns {Promise<Resource>}
     */
    async load() {
        const resource = await this.loadResource();
        resource.linked = await this.loadReferencedResources(resource);

        return resource;
    }

    /**
     * a loading logic method
     * @abstract
     * @returns {Promise<Resource>}
     */
    loadResource() {}

    /**
     * get all other resources referenced by this resource
     * @abstract
     * @param {Resource} resource
     * @returns {Map<string, ResourceLoader>}
     */
    getReferencedResources(resource) {}

    /**
     * load all referenced resources, calling this method before loading 
     * primary resource will probably miss resources
     * @protected
     * @param {Resource} resource
     * @returns {Promise<Map<string, Resource>>}
     */
    async loadReferencedResources(resource) {
        const refResources = this.getReferencedResources(resource);
        const resIds = [...refResources.keys()];

        Promise.all([...refResources.values()].map(res => res.load()))
        .then(vals => {console.log(new Map(vals.map((val, idx) => [resIds[idx], val])))});

        return Promise.all([...refResources.values()].map(res => res.load()))
            .then(vals => new Map(vals.map((val, idx) => [resIds[idx], val])));
    }
}

export default ResourceLoader;

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */
