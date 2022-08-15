/**
 * small module for async loading of resources (images, models, audio, etc)
 * @module ResourceManager
 */

/**
 * package JSON structure
 *  {
 *      "id": <string>
 *      "version": <number?>
 *      "resources": <array>
 *  }
 */

import ImageResourceLoader from "./loader/ImageResourceLoader";
import AudioBufferResourceLoader from "./loader/AudioBufferResourceLoader";
import TextResourceLoader from "./loader/TextResourceLoader";
import JsonResourceLoader from "./loader/JsonResourceLoader";
import CubemapResourceLoader from "./loader/ext/CubemapResourceLoader";
import ColladaResourceLoader from "./loader/ext/ColladaResourceLoader";
import GLTFResourceLoader from "./loader/ext/GLTFResourceLoader";

import ResourceLoader from "./ResourceLoader";
import BinaryResourceLoader from "./loader/BinaryResourceLoader";

class ResourceManager {
    /**
     * create a new resource manager with custom loader types
     * @constructs
     * @param {Object} customTypes 
     */
    constructor(customTypes={}) {
        /**
         * @type {Object<string, function(url:string):ResourceLoader>} this.types
         */
        this.types = Object.assign(ResourceManager.DefaultResourceRequestType, customTypes);
        this.resourceSources = [];
        this.packageSources = [];
        this.resources = new Map();
    }

    /**
     * start loading packages, then resources
     */
    async startLoading() {
        console.log(this.packageSources);
        await this.loadPackages();
        console.log(this.resourceSources);
        await this.loadResources();
        console.log(this.resources);
    }

    /**
     * get a loaded resource
     * @param {string} pid 
     * @returns {any|undefined}
     */
    get(pid, id) {
        if (this.resources !== null)
            return this.resources.get(pid).get(id);
        else
            throw new Error(`accessing resources before loading finished`);
    }

    /**
     * get a package selector, for querying specific resources
     * @param {string} id 
     * @returns {function(rid:string):Resource}
     */
    getPackage(id) {
        if (this.resources.get(id) !== undefined)
            return rid => this.resources.get(id).get(rid);
        else
            throw new Error(`package ${id} does not exist`);
    }

    /**
     * add a new resource request to the queue
     * @param {string} pkgId
     * @param {string} resId 
     * @param {string} spec
     * @param {string} type 
     * @param {string} url
     */
    addResource(pkgId, resId, spec, type, url) {
        this.resourceSources.push({pkgId: pkgId, resId: resId, spec: spec, type: type, url: url});
    }
    
    /**
     * use package, loading in resource sources
     * @param {string} url 
     */
    addPackage(url) {
        if (!this.packageSources.includes(url))
            this.packageSources.push(url);
    }
    
    /**
     * download packages, adding resource sources
     * @private
     * @returns {Promise<Map<string, ResourceSource>>}
     */
    async loadPackages() {
        const packageRequests = this.packageSources
            .map(req => new JsonResourceLoader(req).load());

        for (const packageRequest of await Promise.all(packageRequests)) {
            const packageData = packageRequest.elem;
            for (const resource of packageData.resources) {
                this.addResource(
                    packageData.id,
                    resource.id,
                    resource.spec,
                    resource.type, 
                    resource.url
                );
            }
        }
        
        return this.resourceSources;
    }

    /**
     * download requested resources, returning a promise
     * 
     * @typedef {Object} ResourceSource
     * @property {string} url
     * @property {string} type
     * 
     * @private
     * @returns {Promise<Map<string, any>>}
     */
    async loadResources() {
        const resourceLoaders = this.resourceSources
            .map(req => new this.types[req.type](req.url, req.spec).load());

        // simple waiting, no progress
        // progress is tricky, currently no solution without complete rewrite
        // of basic data structures (maps are out)
        const resources = await Promise.all(resourceLoaders);

        this.resources = new Map();
        
        this.resourceSources.forEach((req, index) => {
            if (this.resources.has(req.pkgId)) {
                this.resources.get(req.pkgId).set(req.resId, resources[index]);
            } else {
                this.resources.set(req.pkgId, new Map([[req.resId, resources[index]]]));
            }
        });
        
        return this.resources;
    }

    /**
     * default types for resource manager
     * @private
     * @readonly
     * @enum {function(url:string):ResourceLoader}
     */
    static DefaultResourceRequestType = {
        image: ImageResourceLoader,
        binary: BinaryResourceLoader,
        audio: AudioBufferResourceLoader,
        text: TextResourceLoader,
        json: JsonResourceLoader,

        cubemap: CubemapResourceLoader,
        collada: ColladaResourceLoader,
        gltf: GLTFResourceLoader
    };
}

export default ResourceManager;

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */
