attribute vec4 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;

uniform mat4 uModelMatrix;
uniform mat4 uPVMatrix;

varying vec3 vNormal;
varying vec2 vTexCoord;

void
main()
{
    gl_Position = uPVMatrix * uModelMatrix * vec4(aPosition.xyz * 16.0, 1.0);

    vNormal = mat3(uModelMatrix) * aNormal;
    vTexCoord = aTexCoord;
}