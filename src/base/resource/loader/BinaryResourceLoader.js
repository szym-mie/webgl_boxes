import Resource from "../Resource";
import ResourceLoader from "../ResourceLoader";

class BinaryResourceLoader extends ResourceLoader {
    constructor(url, spec) {
        super(url, spec);
    }

    loadResource() {
        return fetch(this.url)
            .then(res => res.arrayBuffer())
            .then(elem => new Resource(elem));
    }

    getReferencedResources(resource) {
        return new Map();
    }
}

export default BinaryResourceLoader;

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */
