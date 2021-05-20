/**
 * GLSL object
 */
export abstract class GLSLObject<T extends WebGLContext> {
  /** WebGL context */
  public readonly gl: T;

  /** Object ID */
  protected _id: WebGLObject | null = null;

  /** Valid status */
  protected _status?: boolean;


  /**
   * Creates a new GLSL object.
   *
   * @param gl WebGL context
   */
  public constructor(gl: T) {
    this.gl = gl;
  }


  /**
   * Handle error.
   *
   * @param error Error message
   * @param handler Error handler function
   */
  public static handleError(error: string, onerror?: ErrorHandler): string {
    onerror?.(error);
    console.error(error);
    return error;
  }

  /** Objcet ID */
  public get id(): WebGLObject | null {
    return this._id;
  }

  /** Current status */
  public get status(): boolean {
    return this._status === true;
  }

  /**
   * Release all resources.
   */
  public abstract delete(): void;
}
