const float scale = 16.0;

attribute vec4 position;
attribute vec3 normal;
attribute vec3 tangent;
attribute vec2 texcoord_0;

uniform mat4 model_matrix;
uniform mat4 pv_matrix;

varying vec3 normal_v;
varying vec2 texcoord_0_v;

varying mat3 tbn_matrix_v;

void
main()
{
    gl_Position = pv_matrix * model_matrix * vec4(position.xyz * scale, 1.0);

    normal_v = mat3(model_matrix) * normal;
    texcoord_0_v = texcoord_0;

    vec3 t = mat3(model_matrix) * normalize(-tangent);
    vec3 n = mat3(model_matrix) * normalize(-normal);
    vec3 b = cross(t, n);
    tbn_matrix_v = mat3(t, b, n);
}