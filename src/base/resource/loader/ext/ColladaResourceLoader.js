import Resource from "../../Resource";
import ResourceLoader from "../../ResourceLoader";
import ColladaParser from "../../../mesh/parser/ColladaParser";
import ImageResourceLoader from "../ImageResourceLoader";

class ColladaResourceLoader extends ResourceLoader {
    constructor(url, spec) {
        super(url, spec);
    }

    loadResource() {
        return fetch(this.url)
            .then(res => res.text())
            .then(xml => new Resource(new ColladaParser(xml)));
    }

    getReferencedResources(resource) {
        return resource.elem
            .getTextureUrls()
            .map(url => new ImageResourceLoader(this.getResourceUrlBasePath() + url));
    }
}

export default ColladaResourceLoader;

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */
