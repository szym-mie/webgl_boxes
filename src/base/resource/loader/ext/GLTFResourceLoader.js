import Resource from "../../Resource";
import ResourceLoader from "../../ResourceLoader";
import ImageResourceLoader from "../ImageResourceLoader";
import BinaryResourceLoader from "../BinaryResourceLoader";
import GLTFParser from "../../../mesh/parser/GLTFParser";

class GLTFResourceLoader extends ResourceLoader {
    constructor(url, spec) {
        super(url, spec);
    }

    /**
     * 
     * @returns {Promise<Resource>}
     */
    loadResource() {
        return fetch(this.url)
            .then(res => res.json())
            .then(json => new Resource(new GLTFParser(json)));
    }

    /**
     * 
     * @param {GLTFParser} resource 
     * @returns {Map<string, ResourceLoader>}
     */
    getReferencedResources(resource) {
        const map = new Map();

        for (const [meshName, meshInfo] of resource.elem.meshInfoMap) {
            for (const [imageName, imageInfo] of meshInfo.material) {
                const url = this.getResourceUrlBasePath() + imageInfo.uri;
                map.set(imageName, new ImageResourceLoader(url));
            }

            if (meshInfo.bufferSources !== undefined) {
                for (let i = 0; i < meshInfo.bufferSources.length; i++) {
                    const bufferSource = meshInfo.bufferSources[i];
                    const url = this.getResourceUrlBasePath() + bufferSource.uri;
                    map.set(meshName + '_' + i, new BinaryResourceLoader(url));
                }
            }
        }

        return map;
    }
}

export default GLTFResourceLoader;

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */
