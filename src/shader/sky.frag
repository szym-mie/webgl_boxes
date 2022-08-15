precision mediump float;

varying vec4 position_v;

uniform mat4 pvi_matrix;
uniform samplerCube diffuse_texture;

void
main()
{
    vec4 back_vec = pvi_matrix * position_v;
    gl_FragColor = textureCube(diffuse_texture, back_vec.xyz / back_vec.w);
}