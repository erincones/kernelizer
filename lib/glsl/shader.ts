import { GLSLObject } from "./object";


/**
 * GLSL shader.
 */
export class GLSLShader extends GLSLObject<WebGLContext> {
  /** Stage type */
  public readonly type: WebGLShaderType;

  /** Source code */
  public readonly src: string;


  /**
   * Compile a shader.
   *
   * @param gl WebGL context
   * @param type Stage type
   * @param src Source code
   * @param onerror Error handler
   */
  public constructor(gl: WebGLContext, type: WebGLShaderType, src: string, onerror?: (error: string) => void) {
    super(gl);
    this.type = type;
    this.src = src;
    this._id = this.gl.createShader(this.type);
    const name = type === this.gl.VERTEX_SHADER ? `vertex` : `fragment`;

    if (this.id === null) {
      this.handleError(`create`, name, `nunknown error`, onerror);
    }
    else {
      this.gl.shaderSource(this.id, src);
      this.gl.compileShader(this.id);

      this._status = !!this.gl.getShaderParameter(this.id, this.gl.COMPILE_STATUS);

      if (!this._status) {
        this.handleError(`compile`, name, this.gl.getShaderInfoLog(this.id) || `unknown error`, onerror);
        this.delete();
      }
    }
  }


  /**
   * Format and handle error.
   *
   * @param action Action
   * @param type Shader type
   * @param error Error message
   * @returns Formated string
   */
  private handleError(action: string, type: string, error: string, handler?: ErrorHandler): string {
    return GLSLObject.handleError(`could not ${action} the ${type} shader:\n${error}`, handler);
  }


  /**
   * Delete the shader.
   */
  public delete(): void {
    if (this.status !== undefined) {
      this.gl.deleteShader(this._id);

      delete this._status;
    }
  }
}
