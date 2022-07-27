precision mediump float;

varying vec4 vPosition;

uniform mat4 uPVMatrix;
uniform samplerCube uSkyTexture;

void
main()
{
    vec4 backVec = uPVMatrix * vPosition;
    gl_FragColor = textureCube(uSkyTexture, backVec.xyz / backVec.w);
}