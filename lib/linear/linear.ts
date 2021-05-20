/** Matrix */
export const Mat = Float32Array;


/**
 * Linear algebra.
 */
export class Linear {

  /** Factor conversion from degrees to radians */
  private static readonly _toRad = Math.PI / 180;

  /** Factor conversion from radians to degrees */
  private static readonly _toDeg = 180 / Math.PI;

  /**
   * Convert degrees to radians.
   *
   * @param deg Degrees
   * @returns Radians
   */
  public static toRad(deg: number): number {
    return deg * Linear._toRad;
  }

  /**
   * Convert radians to degrees.
   *
   * @param rad Radians
   * @returns Degrees
   */
  public static toDeg(rad: number): number {
    return rad * Linear._toDeg;
  }
}
