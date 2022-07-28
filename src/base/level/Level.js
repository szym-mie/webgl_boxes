import LevelMesh from "./LevelMesh";

class Level {
    /**
     * 
     * @param {Object} levelDescription 
     * @param {string} levelDescription.id
     * @param {string} levelDescription.pname
     * @param {Array<Array<number>>} levelDescription.spawns
     * @param {Array<Object>} levelDescription.geom
     */
    constructor(program, texture, levelDescription) {
        this.id = levelDescription.id;
        this.pname = levelDescription.pname;
        this.spawns = levelDescription.spawns;
        this.geom = levelDescription.geom;

        this.mesh = new LevelMesh(program, this.geom, texture);
    }
}

export default Level;