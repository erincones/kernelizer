/**
 * Square
 */
interface Square {
  readonly vao: WebGLVertexArrayObject;
  readonly vbo: WebGLBuffer;
}


/**
 * Create an square.
 *
 * @param gl WebGL 2 context
 * @returns Square objects
 */
export const createSquare = (gl: WebGL2RenderingContext): Square => {
  const data = new Float32Array([
  /* eslint-disable indent */
    // Position   // Texture coordinates
    -1,  1,       0, 1,
    -1, -1,       0, 0,
     1,  1,       1, 1,
     1, -1,       1, 0
  /* eslint-enable indent */
  ]);

  // Vertex array object
  const vao = gl.createVertexArray() as WebGLVertexArrayObject;
  gl.bindVertexArray(vao);

  // Vertex buffer object
  const vbo = gl.createBuffer() as WebGLBuffer;
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  // Position attribute
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 4 << 2, 0);

  // Texture coordinate attribute
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 4 << 2, 2 << 2);

  return { vao, vbo };
};
