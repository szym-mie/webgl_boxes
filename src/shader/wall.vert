attribute vec4 aPosition;
attribute vec2 aTexTile;
attribute vec2 aTexCoord;

uniform mat4 uPVMatrix;

varying vec2 vTexTile;
varying vec2 vTexCoord;

void 
main()
{
    gl_Position = uPVMatrix * aPosition;
    vTexTile = aTexTile;
    vTexCoord = aTexCoord;
}