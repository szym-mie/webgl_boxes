attribute vec4 aPosition;
varying vec4 vPosition;

void
main()
{
    vPosition = aPosition;
    gl_Position = vec4(aPosition.xy, 1.0, aPosition.w);
}