import { GLSLObject } from "./object";


/**
 * GLSL plane.
 */
export class GLSLPlane {
  /** Plane data */
  public static readonly data: Readonly<Float32Array> = new Float32Array([
    /* eslint-disable indent */
    // Position   // Texture coordinates
    -1,  1,       0, 1,
    -1, -1,       0, 0,
     1,  1,       1, 1,
     1, -1,       1, 0
    /* eslint-enable indent */
  ]);

  /** Vertex array object */
  private static _vao: WebGLVertexArrayObject | null;

  /** Vertex buffer object */
  private static _vbo: WebGLBuffer | null;

  /** Valid status */
  private static _status?: boolean;


  /**
   * Creates a new plane.
   */
  public static load(gl: WebGL2RenderingContext, onerror?: ErrorHandler): void {
    if (GLSLPlane._status !== undefined) return;

    GLSLPlane._vao = gl.createVertexArray();
    GLSLPlane._vbo = gl.createBuffer();

    if ((GLSLPlane._vao !== null) && (GLSLPlane._vbo !== null)) {
      GLSLPlane._status = true;

      gl.bindVertexArray(GLSLPlane._vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, GLSLPlane._vbo);
      gl.bufferData(gl.ARRAY_BUFFER, GLSLPlane.data, gl.STATIC_DRAW);

      // Position
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);

      // Texture coordinates
      gl.enableVertexAttribArray(1);
      gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);
    }
    else {
      GLSLPlane._status = false;

      if (GLSLPlane._vao === null) GLSLObject.handleError(`could not create the VAO:\nunknown error`, onerror);
      if (GLSLPlane._vbo === null) GLSLObject.handleError(`could not create the VBO:\nunknown error`, onerror);
    }
  }

  /**
   * Get the current status
   */
  public static get vao(): WebGLVertexArrayObject | null {
    return GLSLPlane._vao;
  }

  /**
   * Get the current status
   */
  public static get vbo(): WebGLBuffer | null {
    return GLSLPlane._vbo;
  }

  /**
   * Get the current status
   */
  public static get status(): boolean {
    return GLSLPlane._status === true;
  }

  /**
   * Bind vertex array object.
   *
   * @param gl WebGL 2 context
   */
  public static bind(gl: WebGL2RenderingContext): void {
    if (GLSLPlane._status) gl.bindVertexArray(this._vao);
  }

  /**
   * Draw plane array.
   *
   * @param gl WebGL 2 context
   */
  public static draw(gl: WebGL2RenderingContext): void {
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  /**
   * Release plane resources.
   */
  public static delete(gl: WebGL2RenderingContext): void {
    gl.deleteBuffer(GLSLPlane._vbo);
    gl.deleteVertexArray(GLSLPlane._vao);

    delete GLSLPlane._status;
  }
}