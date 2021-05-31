export default `#version 300 es
precision highp float;

uniform vec2 u_canvas;
uniform vec2 u_offset;
uniform vec2 u_size;
uniform float u_scale;

uniform vec3 u_grid0;
uniform vec3 u_grid1;

uniform sampler2D u_texture;

out vec4 color;


vec3 background(vec2 frag) {
  vec2 board = trunc(fract((frag - u_offset) / 16.0F) + 0.5F);
  float check = board.y > 0.0F ? 1.0F - board.x : board.x;

  return check > 0.0F ? u_grid1 : u_grid0;
}

void main() {
  vec2 frag = vec2(gl_FragCoord.x, u_canvas.y - gl_FragCoord.y);
  vec2 pixel = (frag - u_offset) / vec2(u_scale, u_scale);

  if (
    (pixel.x < 0.0F) || (pixel.x >= u_size.x) ||
    (pixel.y < 0.0F) || (pixel.y >= u_size.y)
  ) {
    discard;
  }

  color = texelFetch(u_texture, ivec2(pixel), 0);
  color = vec4(mix(background(frag), color.xyz, color.w), 1.0F);
}
`;
