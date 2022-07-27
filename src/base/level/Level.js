class Level {
    /**
     * 
     * @param {Object} levelDescription 
     * @param {string} levelDescription.id
     * @param {string} levelDescription.pname
     * @param {Array<Array<number>>} levelDescription.spawns
     * @param {Array<Object>} levelDescription.geom
     */
    constructor(levelDescription) {
        this.id = levelDescription.id;
        this.pname = levelDescription.pname;
        this.spawns = levelDescription.spawns;
        this.geom = levelDescription.geom;
    }
}

export default Level;