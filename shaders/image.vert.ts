export default `#version 300 es
layout (location = 0) in vec2 a_position;
layout (location = 1) in vec2 a_uv_coord;

out vec2 v_uv_coord;

void main() {
  v_uv_coord = a_uv_coord;
  gl_Position = vec4(a_position, 0.0F, 1.0F);
}
`;
