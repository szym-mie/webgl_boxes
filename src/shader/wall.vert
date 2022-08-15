attribute vec4 position;
attribute vec3 normal;
attribute vec3 tangent;
attribute vec2 texcoord_0;
attribute vec2 textile_0;

uniform mat4 pv_matrix;

varying vec3 normal_v;
varying vec2 texcoord_0_v;
varying vec2 textile_0_v;

varying mat3 tbn_matrix_v;

void 
main()
{
    gl_Position = pv_matrix * position;
    normal_v = normal;
    texcoord_0_v = texcoord_0;
    textile_0_v = textile_0;

    vec3 t = normalize(tangent);
    vec3 n = normalize(normal);
    vec3 b = cross(t, n);
    tbn_matrix_v = mat3(t, b, n);
}