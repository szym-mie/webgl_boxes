precision mediump float;

const float texTileWidth = 1.0 / 16.0;

const vec3 sunDirection = vec3(0.743, 0.557, -0.371);
const float sunIntensity = 0.4;
const float ambientIntensity = 0.2;

varying vec3 vNormal;
varying vec2 vTexTile;
varying vec2 vTexCoord;

varying mat3 vTBNMatrix;

uniform sampler2D uDiffTexture;
uniform sampler2D uNormTexture;

void
main()
{
    vec2 texPos = vTexTile + mod(vTexCoord, 1.0);
    vec4 color = texture2D(uDiffTexture, texPos * texTileWidth);
    vec3 nmap = texture2D(uNormTexture, texPos * texTileWidth).xyz;
    nmap = nmap * 2.0 - 1.0;
    nmap = normalize(vTBNMatrix * nmap);
    float sunLightIntensity = dot(sunDirection, nmap) * sunIntensity;
    float lightIntensity = max(sunLightIntensity, 0.0) + ambientIntensity;
    gl_FragColor = vec4(color.rgb * lightIntensity, color.a);
}