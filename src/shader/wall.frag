precision mediump float;

const float textile_width = 1.0 / 16.0;

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

varying vec4 position_v;
varying vec3 normal_v;
varying vec2 texcoord_0_v;
varying vec2 textile_0_v;

varying mat3 tbn_matrix_v;

uniform vec3 camera_position;

uniform sampler2D diffuse_texture;
uniform sampler2D normal_texture;
uniform sampler2D roughness_texture;
uniform sampler2D clearcoat_texture;

uniform samplerCube reflection_texture;

void
main()
{
    vec2 texpos = (textile_0_v + mod(texcoord_0_v, 1.0)) * textile_width;
    vec4 color = texture2D(diffuse_texture, texpos);
    float rough = texture2D(roughness_texture, texpos).r;
    float clearcoat = texture2D(clearcoat_texture, texpos).r;
    vec3 nmap = texture2D(normal_texture, texpos).xyz;
    nmap = nmap * 2.0 - 1.0;
    nmap = normalize(tbn_matrix_v * nmap);

    vec3 eye_to_surf = normalize(position_v.xyz + camera_position);
    vec3 nmap_norm = normalize(nmap);
    vec3 dir = reflect(eye_to_surf, nmap_norm * 0.5);
    // vec3 dir = reflect(eye_to_surf, normal_v);
    float sheen = pow(length(cross(nmap_norm, eye_to_surf)), 2.0);
    vec4 refl = textureCube(reflection_texture, dir);

    float sun_light = dot(sun.dir, nmap) * sun.weight;
    // float sun_light = 1.0;
    vec3 light = sun.color * max(sun_light, 0.0) + ambient.color * ambient.weight;
    float affect_sheen = mix(1.0, sheen, clearcoat);
    gl_FragColor = vec4(mix(color.rgb * light.rgb, refl.rgb, rough * affect_sheen), color.a);
    // gl_FragColor = vec4(refl.rgb, color.a);
    // gl_FragColor = vec4(affect_sheen, 0.0, 0.0, color.a);
}