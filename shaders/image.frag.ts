export default `#version 300 es
precision highp float;

uniform sampler2D u_texture;

in vec2 v_uv_coord;

out vec4 color;

void main() {
  color = texture(u_texture, vec2(v_uv_coord.x, 1.0F - v_uv_coord.y));
}
`;
