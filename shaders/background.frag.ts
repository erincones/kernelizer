export default `#version 300 es
precision highp float;

uniform vec2 viewport;
uniform vec4 fore;
uniform vec4 back;

out vec4 color;

void main() {
  vec2 coord = vec2(gl_FragCoord.x, viewport.y - gl_FragCoord.y);
  vec2 board = trunc(fract(coord / 16.0F) + 0.5F);
  float check = board.y > 0.0F ? 1.0F - board.x : board.x;

  color = check > 0.0F ? back : fore;
}
`;
