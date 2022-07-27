precision mediump float;

const float texTileWidth = 1.0 / float(16);

varying vec2 vTexTile;
varying vec2 vTexCoord;

uniform sampler2D uTexture;

void
main()
{
    vec4 color = texture2D(uTexture, vTexTile * texTileWidth + mod(vTexCoord * texTileWidth, texTileWidth));
    gl_FragColor = vec4(color.rgb / 2.0, color.a);
}