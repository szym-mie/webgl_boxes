import Resource from "./Resource";

class ResourceArray extends Resource {
    /**
     * 
     * @constructs
     * @param  {...Resource} resources 
     */
    constructor(...resources) {
        super(null);

        for (let i = 0; i < resources.length; i++) {
            this.linked.set(i, resources[i]);
        }
    }
}

export default ResourceArray;