attribute vec4 aPosition;
attribute vec3 aNormal;
attribute vec3 aTangent;
attribute vec2 aTexTile;
attribute vec2 aTexCoord;

uniform mat4 uPVMatrix;

varying vec3 vNormal;
varying vec2 vTexTile;
varying vec2 vTexCoord;

varying mat3 vTBNMatrix;

void 
main()
{
    gl_Position = uPVMatrix * aPosition;
    vNormal = aNormal;
    vTexTile = aTexTile;
    vTexCoord = aTexCoord;

    vec3 T = normalize(aTangent);
    vec3 N = normalize(aNormal);
    vec3 B = cross(T, N);
    vTBNMatrix = mat3(T, B, N);
}