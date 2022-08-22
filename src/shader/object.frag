precision mediump float;

struct ambient_light_t {
    vec3 color;
    float weight;
};

struct dir_light_t {
    vec3 color;
    vec3 dir;
    float weight;
};

const ambient_light_t ambient = ambient_light_t(vec3(1.0, 0.45, 0.25), 0.2);
const dir_light_t sun = dir_light_t(vec3(1.0, 0.45, 0.25), vec3(0.912, -0.228, -0.342), 0.8);

varying vec3 normal_v;
varying vec2 texcoord_0_v;

varying mat3 tbn_matrix_v;

uniform sampler2D diffuse_texture;
uniform sampler2D normal_texture;

void
main() 
{
    vec2 texpos = texcoord_0_v;
    vec4 color = texture2D(diffuse_texture, texpos);
    vec3 nmap = texture2D(normal_texture, texpos).xyz;
    nmap = nmap * 2.0 - 1.0;
    nmap = normalize(tbn_matrix_v * nmap);
    float sun_light = dot(sun.dir, nmap) * sun.weight;
    // float sun_light = 1.0;
    vec3 light = sun.color * max(sun_light, 0.0) + ambient.color * ambient.weight;
    gl_FragColor = vec4(color.rgb * light.rgb, color.a);
}