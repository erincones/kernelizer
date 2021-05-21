export default `#version 300 es
precision highp float;

uniform vec2 u_viewport;
uniform vec3 u_grid0;
uniform vec3 u_grid1;

uniform sampler2D u_texture;

in vec2 v_uv_coord;

out vec4 color;


vec3 background() {
  vec2 coord = vec2(gl_FragCoord.x, u_viewport.y - gl_FragCoord.y);
  vec2 board = trunc(fract(coord / 16.0F) + 0.5F);
  float check = board.y > 0.0F ? 1.0F - board.x : board.x;

  return check > 0.0F ? u_grid1 : u_grid0;
}

void main() {
  color = texture(u_texture, v_uv_coord);
  color = vec4(mix(background(), color.xyz, color.w), 1.0F);
}
`;
