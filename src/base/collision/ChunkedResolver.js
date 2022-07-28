import Chunk from "./Chunk";

class ChunkedResolver {
    constructor(step, levelMesh) {
        this.step = step;
        this.levelMesh = levelMesh;

        this.chunks = [];
    }

    addChunk(x, y) {
        const array = [];
        array[y] = new Chunk();
        this.chunks[x] = array;
    }
}

export default ChunkedResolver;