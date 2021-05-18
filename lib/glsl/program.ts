import { GLSLObject } from "./object";
import { GLSLShader } from "./shader";


/**
 * GLSL program
 */
export class GLSLProgram extends GLSLObject<WebGLContext> {
  /** Uniform location store */
  private readonly _store: Map<string, WebGLUniformLocation | null>;

  /** Stage type */
  public readonly vert: GLSLShader;

  /** Source code */
  public readonly frag: GLSLShader;


  /**
   * Link a GLSL program.
   *
   * @param gl WebGL context
   * @param vert Vertex shader
   * @param frag Fragment shader
   * @param onerror Error handler
   */
  constructor(gl: WebGLContext, vert: GLSLShader, frag: GLSLShader, onerror: (error: string) => void) {
    super(gl);
    this._store = new Map();
    this.vert = vert;
    this.frag = frag;

    if ((this.vert.id === null) || (this.frag.id === null)) {
      this._id = null;
      this.handleError(`create`, `not valid shader objects`, onerror);
    }
    else {
      this._id = this.gl.createProgram();

      if (this._id === null) {
        this.handleError(`create`, `unknown error`, onerror);
      }
      else {
        this.gl.attachShader(this._id, this.vert.id);
        this.gl.attachShader(this._id, this.frag.id);
        this.gl.linkProgram(this._id);

        this._status = !!this.gl.getProgramParameter(this._id, this.gl.LINK_STATUS);

        if (!this._status) {
          this.handleError(`link`, this.gl.getProgramInfoLog(this._id) || `unknown error`, onerror);
          this.delete();
        }
      }
    }
  }


  /**
   * Format and handle error.
   *
   * @param action Action
   * @param error Error message
   * @returns Formated string
   */
  private handleError(action: string, error: string, handler?: ErrorHandler): string {
    return GLSLObject.handleError(`could not ${action} the GLSL program:\n${error}`, handler);
  }


  /**
   * Use GLSL program.
   */
  public use(): void {
    if (this._status) this.gl.useProgram(this._id);
  }

  /**
   * Get uniform location.
   *
   * @param name Uniform location
   */
  public getLocation(name: string): WebGLUniformLocation | null {
    if (!this._status) return null;

    // Known location
    const known = this._store.get(name);

    if (known !== undefined) return known;

    // Get location
    const location = this.gl.getUniformLocation(this._id as never, name);
    this._store.set(name, location);
    return location;
  }

  /**
   * Delete the attached shaders.
   */
  public deleteShaders(): void {
    this.vert.delete();
    this.frag.delete();
  }

  /**
   * Delete the GLSL program.
   */
  public delete(): void {
    if (this.status !== undefined) {
      this.deleteShaders();
      this.gl.deleteProgram(this._id);

      delete this._status;
    }
  }
}
