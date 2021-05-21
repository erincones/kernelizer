export default `#version 300 es
layout (location = 0) in vec2 a_position;
layout (location = 1) in vec2 a_tex_coord;

uniform mat4 u_matrix;

out vec2 v_tex_coord;


void main() {
  v_tex_coord = vec2(a_tex_coord.x, 1.0F - a_tex_coord.y);
  gl_Position = u_matrix * vec4(a_position, 0.0F, 1.0F);
}
`;
