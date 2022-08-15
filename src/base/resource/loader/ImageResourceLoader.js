import Resource from "../Resource";
import ResourceLoader from "../ResourceLoader";

class ImageResourceLoader extends ResourceLoader {
    constructor(url, spec) {
        super(url, spec);
    }

    loadResource() {
        const image = new Image();
        image.src = this.url;

        return new Promise((resolve, reject) => {
            image.onload = async () => {
                resolve(new Resource(await createImageBitmap(image)));
            };
            image.onerror = () => {
                reject("bitmap cannot be loaded");
            };
        });
    }

    getReferencedResources(resource) {
        return new Map();
    }
}

export default ImageResourceLoader;

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */
