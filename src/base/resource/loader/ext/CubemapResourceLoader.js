import Resource from "../../Resource";
import ResourceLoader from "../../ResourceLoader";
import ImageResourceLoader from "../ImageResourceLoader";

class CubemapResourceLoader extends ResourceLoader {
    constructor(urlInfo, spec) {
        super(urlInfo, spec);
    }

    loadResource() {
        return new Promise((resolve, _) => { resolve(new Resource(undefined)); });
    }

    getReferencedResources(resource) {
        const sides = ["px", "nx", "py", "ny", "pz", "nz"];

        console.log(new Map(sides.map(side => 
            [side, new ImageResourceLoader(this.url.start + side + this.url.end)]
        )));

        return new Map(sides.map(side => 
            [side, new ImageResourceLoader(this.url.start + side + this.url.end)]
        ));
    }
}

export default CubemapResourceLoader;

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */
