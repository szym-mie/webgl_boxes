precision mediump float;

const vec3 sunDirection = vec3(0.743, -0.557, -0.371);
// const vec3 sunDirection = vec3(0.707, 0.707, 0.0);
const float sunIntensity = 0.4;
const float ambientIntensity = 0.2;

varying vec3 vNormal;
varying vec2 vTexCoord;

uniform sampler2D uDiffTexture;

void
main() 
{
    vec4 color = texture2D(uDiffTexture, vTexCoord * vec2(1, -1));

    float sunLightIntensity = dot(sunDirection, vNormal * -1.0) * sunIntensity;
    // float sunLightIntensity = 1.0;
    float lightIntensity = max(sunLightIntensity, 0.0) + ambientIntensity;
    gl_FragColor = vec4(color.rgb * lightIntensity, color.a);
}