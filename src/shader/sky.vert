attribute vec4 position;
varying vec4 position_v;

void
main()
{
    position_v = position;
    gl_Position = vec4(position.xy, 1.0, position.w);
}