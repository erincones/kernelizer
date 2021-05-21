export default `#version 300 es
layout (location = 0) in vec2 a_position;
layout (location = 1) in vec2 a_uv_coord;

uniform mat4 u_matrix;

out vec2 v_uv_coord;

void main() {
  v_uv_coord = vec2(a_uv_coord.x, 1.0F - a_uv_coord.y);
  gl_Position = u_matrix * vec4(a_position, 0.0F, 1.0F);
}
`;
