/**
 * `ImageData` extension for pixel manipulation.
 */
export class Picture {
  // Private static members

  /**
   * `CanvasRenderingContext2D` support error.
   */
  private static readonly SUPPORT_ERROR = new Error(`your browser does not support CanvasRenderingContext2D`);


  // Factories

  /**
   * Creates a new `Picture` instance from the given `ImageData`.
   *
   * @param img `ImageData`
   * @returns `Picture` instance
   */
  public static fromImageData = (img: ImageData): Picture => {
    return new Picture(img.data, img.width, img.height);
  }

  /**
   * Creates a new `Picture` instance from the given `CanvasRenderingContext2D`
   * or `OffscreenCanvasRenderingContext2D` with the specified width and height.
   *
   * @param ctx `CanvasRenderingContex2D`
   * @param width Canvas width
   * @param height Canvas height
   * @returns `Picture` instance
   */
  public static fromContext = (ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, width: number, height: number): Picture => {
    return Picture.fromImageData(ctx.getImageData(0, 0, width, height));
  }

  /**
   * Creates a new `Picture` instance from the given `HTMLCanvasElement`.
   *
   * @param canvas `HTMLCanvasElement`
   * @returns `Picture` instance
   */
  public static fromCanvas = (canvas: HTMLCanvasElement): Picture => {
    const ctx = canvas.getContext(`2d`);

    if (ctx === null) throw Picture.SUPPORT_ERROR;

    return Picture.fromContext(ctx, canvas.width, canvas.height);
  }

  /**
   * Creates a new `Picture` instance from the given `HTMLImageElement`.
   *
   * @param img `HTMLImageElement`
   * @returns `Picture` instance
   */
  static fromImage = (img: HTMLImageElement): Picture => {
    const cnv = document.createElement(`canvas`);
    const ctx = cnv.getContext(`2d`);

    if (ctx === null) throw Picture.SUPPORT_ERROR;

    cnv.width = img.width;
    cnv.height = img.height;
    ctx.drawImage(img, 0, 0);

    return Picture.fromContext(ctx, img.width, img.height);
  }


  // Properties

  /**
   * Image data
   */
  public readonly image: ImageData;


  // Constructor

  /**
   * Creates a new `Picture` instance.
   *
   * @param data `Uint8ClampedArray`
   * @param width Picture width
   * @param height Picture height
   */
  private constructor(data: Uint8ClampedArray, width: number, height: number) {
    this.image = new ImageData(data, width, height);
  }


  // Public methods

  public scale(x: number, y: number): Picture {
    // Source size and data
    const srcW = this.image.width;
    const srcH = this.image.height;
    const src = this.image.data;

    // No scale
    if ((x === 1) && (y === 1)) {
      return new Picture(src, srcW, srcH);
    }


    // Destiny size and data
    const dstW = Math.trunc(x * srcW);
    const dstH = Math.trunc(y * srcH);
    const dst = new Uint8ClampedArray(dstW * dstH * 4);

    // Scale
    const dx = 1 / x;
    const dy = 1 / y;
    const dd = dstW << 2;

    for (let sj = 0, dj = 0; sj < srcH; sj += dy, dj += dd) {
      for (let si = 0, b = dj; si < srcW; si += dx, b += 4) {
        const a = (Math.trunc(sj) * srcW + Math.trunc(si)) << 2;

        dst[b]     = src[a];
        dst[b + 1] = src[a + 1];
        dst[b + 2] = src[a + 2];
        dst[b + 3] = src[a + 3];
      }
    }

    // Return new picture
    return new Picture(dst, dstW, dstH);
  }
}
