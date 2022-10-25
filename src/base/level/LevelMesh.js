import MeshIndexed from "../mesh/MeshIndexed";
import LevelBox from "./LevelBox";
import GeometryArray from "../mesh/GeometryArray";
import Program from "../../webgl/Program";
import Texture2D from "../../webgl/Texture2D";
import Camera from "../Camera";
import Vector3 from "../../webgl/Vector3";
import TextureCubemap from "../../webgl/TextureCubemap";

class LevelMesh extends MeshIndexed {
    /**
     * 
     * @param {Program} program 
     * @param {Array<Object>} levelMapInfo 
     * @param {Texture2D} diffTexture diffuse texture
     * @param {Texture2D} normTexture normal texture
     * @param {Texture2D} roughTexture roughness texture
     * @param {Texture2D} clrcTexture clearcoat texture
     * @param {TextureCubemap} reflCubemap reflection skybox
     */
    constructor(program, levelMapInfo, diffTexture, normTexture, roughTexture, clrcTexture, reflCubemap) {
        const initBoxes = levelMapInfo.map(box => 
            new LevelBox(box.bbox.start, box.bbox.end, box.tex)
        );

        const arrayType = program.gl.FLOAT;
        const indexArrayType = program.gl.UNSIGNED_SHORT;

        super(
            program,
            LevelMesh.buildInitGeometry(initBoxes, arrayType),
            LevelMesh.buildIndexGeometry(initBoxes, indexArrayType),
            new Map([
                ["diffuse_texture", diffTexture],
                ["normal_texture", normTexture],
                ["roughness_texture", roughTexture],
                ["clearcoat_texture", clrcTexture],
                ["reflection_texture", reflCubemap]
            ])
        );
    }

    /**
     * 
     * @param {Array<LevelBox>} boxesArray
     * @param {GLenum} arrayType
     * @returns {Map<string, GeometryArray>}
     */
    static buildInitGeometry(boxesArray, arrayType) {
        const getBoxesGeometryArray = (prop, components) => 
            new GeometryArray(boxesArray.map(b => b[prop]).flat(), components, arrayType);

        return new Map([
            ["position", getBoxesGeometryArray("positionData", 3)],
            ["normal", getBoxesGeometryArray("normalData", 3)],
            ["tangent", getBoxesGeometryArray("tangentData", 3)],
            ["texcoord_0", getBoxesGeometryArray("texCoordData", 2)],
            ["textile_0", getBoxesGeometryArray("texTileData", 2)]
        ]);
    }

    /**
     * 
     * @param {Array<LevelBox>} boxesArray 
     * @param {GLenum} arrayType
     * @returns {GeometryArray}
     */
    static buildIndexGeometry(boxesArray, arrayType) {
        const array = boxesArray
            .map((b, i) => b.indexData.map(f => f + i * 24))
            .flat();

        return new GeometryArray(array, 3, arrayType);
    }

    /**
     * does not need to bind anything else
     * @param {Camera} camera
     */
    bindOther(camera) {
        this.program.bindVector3("camera_position", camera.position);
    }
}

export default LevelMesh;

/**
 * @author szym.mie <szym.mie@gmail.com>
 * @copyright szym.mie 2022
 * @license MIT
 */
