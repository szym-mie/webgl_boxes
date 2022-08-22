import Program from './webgl/Program';
import Buffer from './webgl/Buffer';
import MapObjectMesh from './base/mapobject/MapObjectMesh';
import Texture2D from './webgl/Texture2D';
import TextureCubemap from './webgl/TextureCubemap';
import Camera from "./base/Camera";
import ResourceManager from './base/resource/ResourceManager';
import Controls from './base/Controls';
import Level from './base/level/Level';
import Matrix4 from './webgl/Matrix4';

/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('c');
const gl = canvas.getContext('webgl');

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
gl.viewport(0, 0, canvas.width, canvas.height);

const camera = new Camera(
    Math.PI / 3, 
    gl.canvas.width / gl.canvas.height, 
    1, 
    1024
);

const controls = new Controls(gl.canvas, camera);

window.addEventListener('resize', () => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    camera.aspect = canvas.width / canvas.height;
    camera.resize();
});

const resourceManager = new ResourceManager();

resourceManager.addPackage("./src/pkg/min.pkg.json");

resourceManager
    .startLoading()
    .then(() => { main() });

function main() {
    const minTestRes = resourceManager.getPackage("testMin");

    console.log(minTestRes('ifvModel'));

    gl.cullFace(gl.BACK);

    const mapObjectProgram = new Program(
        gl,
        minTestRes("mapObjectShaderVert").elem,
        minTestRes("mapObjectShaderFrag").elem,
        ["position", "normal", "tangent", "texcoord_0"],
        ["pv_matrix", "model_matrix", "diffuse_texture", "normal_texture"]
    );

    // const bmp2Texture = new Texture2D(gl,
    //     minTestRes('ifvModel').getLinked(0).elem,
    //     gl.RGB, gl.RGB
    // );
    // bmp2Texture.setFilters(gl.NEAREST_MIPMAP_LINEAR, gl.NEAREST)
    const bmp2Mesh = new MapObjectMesh(
        mapObjectProgram,
        "body",
        minTestRes("ifvModel")
    );

    bmp2Mesh.position[2] = 128;
    bmp2Mesh.modelMatrix.setFromAxisAngle([0, 1, 0], 2.5);
    bmp2Mesh.update();

    const handMesh = new MapObjectMesh(
        mapObjectProgram,
        "hand",
        minTestRes("handModel")
    );

    const handHoldMesh = new MapObjectMesh(
        mapObjectProgram,
        "hand",
        minTestRes("handHoldModel")
    );

    const armyPistolMesh = new MapObjectMesh(
        mapObjectProgram,
        "gun",
        minTestRes("armyPistolModel")
    );

    const revfRifleMesh = new MapObjectMesh(
        mapObjectProgram,
        "gun",
        minTestRes("revfRifleModel")
    );
    

    console.log(
        minTestRes("wallShaderVert").elem, 
        minTestRes("wallShaderFrag").elem
    );

    const wallProgram = new Program(
        gl, 
        minTestRes('wallShaderVert').elem, 
        minTestRes('wallShaderFrag').elem, 
        ["position", "normal", "tangent", "textile_0", "texcoord_0"], 
        ["pv_matrix", "diffuse_texture", "normal_texture", "roughness_texture", "reflection_texture", "camera_position"]
    );

    const wallDiffTexture = new Texture2D(gl, minTestRes('mapTexDiffImg').elem, gl.RGB, gl.RGB);
    wallDiffTexture.setFilters(gl.NEAREST_MIPMAP_LINEAR, gl.NEAREST);

    const wallNormTexture = new Texture2D(gl, minTestRes('mapTexNormImg').elem, gl.RGB, gl.RGB);
    wallNormTexture.setFilters(gl.NEAREST_MIPMAP_LINEAR, gl.NEAREST);

    const wallReflTexture = new Texture2D(gl, minTestRes('mapTexReflImg').elem, gl.RGB, gl.RGB);
    wallReflTexture.setFilters(gl.NEAREST_MIPMAP_LINEAR, gl.NEAREST);

    const skyTexture = new TextureCubemap(gl, minTestRes('skyTex').linkedElementsObject(), gl.RGB, gl.RGB);
    skyTexture.setFilters(gl.NEAREST, gl.NEAREST);

    const level = new Level(wallProgram, wallDiffTexture, wallNormTexture, wallReflTexture, skyTexture, minTestRes("map01").elem);
    console.log(level);
    console.log(level.mesh);

    // wallProgram.bindArrayBuffer('aPosition', wallBuffers['pos']);
    // wallProgram.bindArrayBuffer('aTexCoord', wallBuffers['tex']);
    // wallProgram.bindArrayBuffer('aTexTile', wallBuffers['tile']);

    console.log(camera);

    controls.position.set(100, -16, -256);

    // camera.viewMatrix.setTranslation(new Vector3().set(0, 0, -80)).rotateY(0.5);
    camera.update();

    let angle = 0.0;

    console.log(gl.canvas.width / gl.canvas.height);

    // wallProgram.bindMatrix4('uPVMatrix', camera.pvMatrix);

    // wallProgram.bindTexture('uTexture', 0, wallTexture);

    const skyProgram = new Program(
        gl, 
        minTestRes('skyShaderVert').elem, 
        minTestRes('skyShaderFrag').elem,
        ['position'],
        ['pvi_matrix', 'diffuse_texture']);

    const skyBuffers = {
        'position': new Buffer(gl, gl.ARRAY_BUFFER, screenSpaceGeometry, gl.FLOAT, 2, false)
    };

    console.log(minTestRes('skyTex').linkedElementsObject());

    skyProgram.use();

    skyProgram.bindArrayBuffer('position', skyBuffers['position']);

    skyProgram.bindTexture('diffuse_texture', 7, skyTexture);

    skyProgram.bindMatrix4('pvi_matrix', camera.pvInvMatrix);

    controls.enable();

    let wpnMesh = armyPistolMesh;

    render(0);

    function render(time) {
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);

        gl.viewport(0, 0, canvas.width, canvas.height);

        // angle += 0.01;
        // viewMatrix.rotateY(angle);
        camera.update();

        // gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.depthFunc(gl.LESS);

        // wallProgram.use();

        // wallProgram.bindArrayBuffer('aPosition', wallBuffers['pos']);
        // wallProgram.bindArrayBuffer('aTexCoord', wallBuffers['tex']);
        // wallProgram.bindArrayBuffer('aTexTile', wallBuffers['tile']);

        // wallProgram.bindTexture('uTexture', 0, wallTexture);

        // wallProgram.bindMatrix4('uPVMatrix', camera.pvMatrix);

        // gl.drawArrays(gl.TRIANGLES, 0, 6);

        const handOffsetMatrix = new Matrix4();

        const xOffset = -0.8;
        const yOffset = Math.sin(time / 550) * 0.03 + 1;
        const zOffset = Math.cos(time / 700) * 0.02 + (controls.weaponSel === 3 ? 1.5 : 2.5);
        // const yOffset = 1;
        // const zOffset = (controls.weaponSel === 3 ? 1.5 : 2.5);

        const xMoveOffset = Math.sin(Math.sin(controls.moveOffset / 11)) * 0.1 * controls.moveSpeed;
        const yMoveOffset = Math.cos(Math.sin(-controls.moveOffset / 11 + 0.7)) * 0.15 * controls.moveSpeed;

        handOffsetMatrix.setTranslation([xOffset + xMoveOffset, yOffset + yMoveOffset, zOffset]);
        handOffsetMatrix.multiply(controls.camera.viewMatrix);

        switch(controls.weaponSel) {
            case 2:
                wpnMesh = armyPistolMesh;
                break;
            case 3:
                wpnMesh = revfRifleMesh;
                break;
        }

        wpnMesh.modelMatrix.setFrom(handOffsetMatrix);
        wpnMesh.modelMatrix.invert();

        handMesh.modelMatrix.setFrom(wpnMesh.modelMatrix);
        handHoldMesh.modelMatrix.setFrom(wpnMesh.modelMatrix);

        level.mesh.draw(camera);

        bmp2Mesh.draw(camera);

        wpnMesh.draw(camera);
        handMesh.draw(camera);
        if (controls.weaponSel === 3) {
            handHoldMesh.draw(camera);
        }

        gl.depthFunc(gl.LEQUAL);

        skyProgram.use();

        skyProgram.bindArrayBuffer('position', skyBuffers['position']);

        skyProgram.bindTexture('diffuse_texture', 0, skyTexture);

        skyProgram.bindMatrix4('pvi_matrix', camera.pvInvMatrix);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        controls.update();

        requestAnimationFrame(render);
    }
}

const screenSpaceGeometry = new Float32Array([
    -1, -1,
    1, -1,
    -1, 1,
    -1, 1,
    1, -1,
    1, 1,
]);