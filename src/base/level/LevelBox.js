import Vector2 from "../../webgl/Vector2";
import Vector3 from "../../webgl/Vector3";

class LevelBox {
    /**
     * 
     * @constructs
     * @param {Vector3} start 
     * @param {Vector3} end 
     * @param {Array<number>} tex
     */
    constructor(start, end, tex) {
        this.start = start;
        this.end = end;
        this.tex = tex;

        this.dimensions = new Vector3(end).subtract(start);

        const p = [start, end];

        const vertices = LevelBox.VERTICES_SCAFFOLD
            .map(([xs, ys, zs]) => new Vector3([p[xs][0], p[ys][1], p[zs][2]]));

        this.positionData = [];
        this.normalData = [];
        this.tangentData = [];
        this.texCoordData = [];
        this.texTileData = [];
        this.indexData = [];
        
        for (let i = 0; i < 6; i++) {
            const axis = LevelBox.QUAD_AXIS[i];
            const face = LevelBox.QUAD_FACES[i];

            this.positionData[i] = this.getSidePositionArrayData(face, vertices);
            this.normalData[i] = this.getSideNormalArrayData(i);
            this.tangentData[i] = this.getSideTangentArrayData(i);
            this.texCoordData[i] = this.getSideTexCoordArrayData(axis);
            this.texTileData[i] = this.getSideTexTileArrayData(i);
            this.indexData[i] = this.getSideIndices(i);
        }

        this.positionData = this.positionData.flat();
        this.normalData = this.normalData.flat();
        this.tangentData = this.tangentData.flat();
        this.texCoordData = this.texCoordData.flat();
        this.texTileData = this.texTileData.flat();
        this.indexData = this.indexData.flat();
    }

    getSideIndices(offset) {
        const absOffset = offset * 4;

        return LevelBox.QUAD_INDEX_SCAFFOLD.map(i => i + absOffset);
    }

    getSidePositionArrayData(indices, vertices) {
        return indices
            .map(i => vertices[i])
            .map(v => [...v])
            .flat();
    }

    getSideNormalArrayData(side) {
        return new Array(4)
            .fill(LevelBox.QUAD_NORMALS[side])
            .flat();
    }

    getSideTangentArrayData(side) {
        return new Array(4)
            .fill(LevelBox.QUAD_TANGENTS[side])
            .flat();
    }

    getSideTexCoordArrayData(axis) {
        const texWidth = [...this.dimensions]
            .filter((_, i) => i != axis)
            .map(v => v / LevelBox.TEX_NOMINAL_SCALE);

        const texWidthNormalized = axis == 0 ? texWidth.reverse() : texWidth;

        console.log(texWidth);

        return LevelBox.QUAD_SCAFFOLD
            .map(qs => new Vector2(texWidthNormalized).multiply(qs))
            .map(v => [...v])
            .flat();
    }

    getSideTexTileArrayData(side) {
        const tid = this.tex[side];
        const tt = [tid % LevelBox.tilesPerTex, Math.floor(tid / LevelBox.tilesPerTex)];

        return [tt, tt, tt, tt].flat();
    }

    static tilesPerTex = 16;

    static TEX_NOMINAL_SCALE = 32;

    static VERTICES_SCAFFOLD = [
        [0, 0, 1],
        [1, 0, 1],
        [0, 1, 1],
        [1, 1, 1],
        [1, 0, 0],
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 0]
    ];

    static QUAD_INDEX_SCAFFOLD = [
        0, 1, 2,
        3, 2, 1
    ];

    static QUAD_SCAFFOLD = [
        [0, 1],
        [1, 1],
        [0, 0],
        [1, 0],
    ];

    static QUAD_NORMALS = [
        [0, 0, -1],
        [1, 0, 0],
        [0, 0, 1],
        [-1, 0, 0],
        [0, 1, 0],
        [0, -1, 0]
    ];

    static QUAD_TANGENTS = [
        [-1, 0, 0],
        [0, 0, -1],
        [1, 0, 0],
        [0, 0, 1],
        [0, 0, -1],
        [0, 0, 1]
    ];

    static QUAD_FACES = [
        [0, 1, 2, 3], // north
        [5, 0, 7, 2], // east
        [4, 5, 6, 7], // south
        [1, 4, 3, 6], // west
        [6, 7, 3, 2], // top
        [1, 0, 4, 5] // bottom
    ];

    static QUAD_AXIS = [
        2, // north
        0, // east
        2, // south
        0, // west
        1, // top
        1, // bottom
    ];
}

export default LevelBox;