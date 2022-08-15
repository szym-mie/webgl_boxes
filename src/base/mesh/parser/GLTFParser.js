import MeshInfo from "../MeshInfo";

class GLTFParser {
    /**
     * construct a new model info
     * @constructs
     * @param {string} gltf
     */
    constructor(gltf) {
        this.meshInfoMap = this.getMeshInfoMap(gltf);
    }

    /**
     * 
     * @param {Object} gltf 
     * @returns {Map<string, MeshInfo>}
     */
    getMeshInfoMap(gltf) {
        const meshMap = new Map();

        for (const node of gltf.nodes) {
            const mesh = gltf.meshes[node.mesh];
            const primitives = mesh.primitives[0];
            const meshInfo = new MeshInfo(
                this.getMaterials(gltf, primitives.material),
                this.getGeometryArrays(gltf, primitives.attributes),
                this.getIndicesArray(gltf, primitives.indices),
                this.getBufferSources(gltf)
            );
            meshMap.set(node.name, meshInfo);
        }

        return meshMap;
    }

    getMaterials(gltf, id) {
        const material = gltf.materials[id];
        const pbr = material.pbrMetallicRoughness;

        return new Map([
            ["diffuse_texture", this.getTexture(gltf, pbr.baseColorTexture.index)],
            ["normal_texture", this.getTexture(gltf, material.normalTexture.index)]
        ]);
    }

    getGeometryArrays(gltf, attributes) {
        return new Map(
            Object.entries(attributes)
                .map(([k, v]) => [k.toLowerCase(), this.getBufferView(gltf, v)])
        );
    }

    getIndicesArray(gltf, indicesId) {
        return this.getBufferView(gltf, indicesId);
    }

    getBufferSources(gltf) {
        return gltf.buffers;
    }

    getTexture(gltf, id) {
        const texture = gltf.textures[id];
        const image = gltf.images[texture.source];
        const sampler = gltf.samplers[texture.sampler];

        return {
            name: image.name,
            uri: image.uri,
            magFilter: sampler.magFilter,
            minFilter: sampler.minFilter,
            wrapS: sampler.wrapS,
            wrapT: sampler.wrapT
        };
    }

    getBufferView(gltf, id) {
        const access = gltf.accessors[id];
        const bufferView = gltf.bufferViews[access.bufferView];

        return {
            bufferId: bufferView.buffer,
            byteLength: bufferView.byteLength,
            byteOffset: bufferView.byteOffset,
            componentType: access.componentType,
            components: GLTFParser.TYPE_SIZES[access.type],
            count: access.count * GLTFParser.TYPE_SIZES[access.type]
        };
    }

    /**
     * all GLTF buffer data types
     * @enum {number}
     */
    static TYPE_SIZES = {
        "SCALAR": 1,
        "VEC2": 2,
        "VEC3": 3,
        "VEC4": 4,
        "MAT2": 4,
        "MAT3": 9,
        "MAT4": 16,
    }
}

export default GLTFParser;

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */
