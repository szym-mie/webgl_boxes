import Program from './webgl/Program';
import Buffer from './webgl/Buffer';
import Matrix4 from './webgl/Matrix4';
import Vector3 from './webgl/Vector3';
import Texture2D from './webgl/Texture2D';
import TextureCubemap from './webgl/TextureCubemap';
import Camera from "./base/Camera";
import ResourceManager from './base/resource/ResourceManager';
import Controls from './base/Controls';
import Level from './base/level/Level';
import LevelMesh from './base/level/LevelMesh';

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



    console.log(
        minTestRes('wallShaderVert').elem, 
        minTestRes('wallShaderFrag').elem
    );

    const wallProgram = new Program(
        gl, 
        minTestRes('wallShaderVert').elem, 
        minTestRes('wallShaderFrag').elem, 
        ["aPosition", "aNormal", "aTexTile", "aTexCoord"], 
        ['uPVMatrix', 'uTexture']
    );

    const wall = {
        'pos': new Float32Array([ 
            -20, -20, 0, 
            20, -20, 0, 
            -20, 20, 0,
            -20, 20, 0, 
            20, -20, 0, 
            20, 20, 0
        ]),
        'tex': new Float32Array([
            0, 2, 
            2, 2,
            0, 0,
            0, 0,
            2, 2,
            2, 0
        ]),
        'tile': new Float32Array([
            4, 0,
            4, 0,
            4, 0,
            4, 0,
            4, 0,
            4, 0,
        ]),
    };

    const wallBuffers = {
        'pos': new Buffer(gl, wall.pos, gl.ARRAY_BUFFER, 3, false),
        'tex': new Buffer(gl, wall.tex, gl.ARRAY_BUFFER, 2, false),
        'tile': new Buffer(gl, wall.tile, gl.ARRAY_BUFFER, 2, false),
    };

    const wallTexture = new Texture2D(gl, minTestRes('mapTexDiffImg').elem, gl.RGB, gl.RGB);
    wallTexture.setFilters(gl.NEAREST_MIPMAP_LINEAR, gl.NEAREST);

    const level = new Level(wallProgram, wallTexture, minTestRes("map01").elem);
    console.log(level);
    console.log(level.mesh);

    // wallProgram.bindArrayBuffer('aPosition', wallBuffers['pos']);
    // wallProgram.bindArrayBuffer('aTexCoord', wallBuffers['tex']);
    // wallProgram.bindArrayBuffer('aTexTile', wallBuffers['tile']);

    console.log(camera);

    controls.position.set(100, -16, -160);

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
        ['aPosition'],
        ['uPVMatrix', 'uSkyTexture']);

    const skyBuffers = {
        'pos': new Buffer(gl, screenSpaceGeometry, gl.ARRAY_BUFFER, 2, false)
    };

    console.log(minTestRes('skyTex').linkedElementsObject());

    const skyTexture = new TextureCubemap(gl, minTestRes('skyTex').linkedElementsObject(), gl.RGB, gl.RGB);
    skyTexture.setFilters(gl.NEAREST, gl.NEAREST);

    skyProgram.use();

    skyProgram.bindArrayBuffer('aPosition', skyBuffers['pos']);

    skyProgram.bindTexture('uSkyTexture', 7, skyTexture);

    skyProgram.bindMatrix4('uPVMatrix', camera.pvInvMatrix);

    console.log(wallProgram, wallBuffers, skyProgram, skyBuffers, gl.TEXTURE0, gl.TEXTURE1, gl.TEXTURE2);

    controls.enable();

    render();

    function render() {
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

        level.mesh.draw(camera);

        gl.depthFunc(gl.LEQUAL);

        skyProgram.use();

        skyProgram.bindArrayBuffer('aPosition', skyBuffers['pos']);

        skyProgram.bindTexture('uSkyTexture', 0, skyTexture);

        skyProgram.bindMatrix4('uPVMatrix', camera.pvInvMatrix);

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