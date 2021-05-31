import { GLSLObject } from "./object";


/**
 * GLSL texture.
 */
export class GLSLTexture2D extends GLSLObject<WebGL2RenderingContext> {
  /** Transparent pixel */
  private static readonly transparent_pixel = new Uint8Array([ 0, 0, 0, 0 ]);

  /** Texture unit */
  private readonly _unit: number;

  /**
   *
   * @param gl WebGL 2 context
   * @param img Texture image source
   * @param unit Texture unit
   * @param onerror Error handler
   */
  constructor(gl: WebGL2RenderingContext, img: TexImageSource | null | undefined, unit = 0, onerror?: ErrorHandler) {
    super(gl);
    this._id = this.gl.createTexture();
    this._unit = unit;

    if (this._id === null) {
      GLSLTexture2D.handleError(`could not create the texture:\nunknown error`, onerror);
    }
    else {
      this.updateImageSource(img);

      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    }
  }

  /** Texture unit */
  public get unit(): number {
    return this._unit;
  }

  /**
   * Bind texture.
   */
  public bind(): void {
    this.gl.activeTexture(this.gl.TEXTURE0 + this._unit);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this._id);
  }

  /**
   * Update image source.
   *
   * @param img Image source
   */
  public updateImageSource(img?: TexImageSource | null): void {
    this.bind();
    this._status = !!img;

    if (img) {
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGBA,
        img.width,
        img.height,
        0,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        img
      );
    }
    else {
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGBA,
        1,
        1,
        0,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        GLSLTexture2D.transparent_pixel
      );
    }
  }

  /**
   * Delete the shader.
   */
  public delete(): void {
    if (this.status !== undefined) {
      this.gl.deleteTexture(this._id);

      delete this._status;
    }
  }
}