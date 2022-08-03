import Resource from "../../Resource";
import ResourceLoader from "../../ResourceLoader";
import ColladaRawModel from "../../../ColladaRawModel";
import ImageResourceLoader from "../ImageResourceLoader";

class ColladaResourceLoader extends ResourceLoader {
    constructor(url, spec) {
        super(url, spec);
    }

    loadResource() {
        return fetch(this.url)
            .then(res => res.text())
            .then(xml => new Resource(new ColladaRawModel(xml)));
    }

    getReferencedResources(resource) {
        return resource.elem
            .getTextureUrls()
            .map(url => new ImageResourceLoader(this.getResourceUrlBasePath() + url));
    }
}

export default ColladaResourceLoader;
