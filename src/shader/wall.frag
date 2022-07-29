precision mediump float;

const float texTileWidth = 1.0 / float(16);

const vec3 sunDirection = vec3(0.743, 0.557, -0.371);
const float sunIntensity = 0.4;
const float ambientIntensity = 0.2;

varying vec3 vNormal;
varying vec2 vTexTile;
varying vec2 vTexCoord;

uniform sampler2D uTexture;

void
main()
{
    vec4 color = texture2D(uTexture, vTexTile * texTileWidth + mod(vTexCoord * texTileWidth, texTileWidth));
    float sunLightIntensity = dot(sunDirection, vNormal) * sunIntensity;
    float lightIntensity = max(sunLightIntensity, 0.0) + ambientIntensity;
    gl_FragColor = vec4(color.rgb * lightIntensity, color.a);
}