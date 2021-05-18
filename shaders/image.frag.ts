export default `#version 300 es
precision highp float;

in vec2 v_uv_coord;

out vec4 color;

void main() {
  float x = v_uv_coord.x;
  float y = v_uv_coord.y;

  float val = y - 0.5F;
  float max = sqrt(1.0F - pow(4.0F * (x - 0.5F), 2.0F)) / 2.5F;

  if (x < 0.25F || x > 0.75F) discard;
  if (val > max || val < -max) discard;

  color = vec4(v_uv_coord, 0, 1.0F);
}
`;
