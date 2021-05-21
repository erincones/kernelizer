import { Mat } from "./linear";


/**
 * Three entries vector.
 */
export class Vec3 {
  /** Zero 4x4 matrix */
  public static zero(): Mat {
    return new Mat(3);
  }

  /**
   * Normalize the given vector.
   *
   * @param out Destination
   * @param vec Vector
   * @returns Normalized vector
   */
  public static normalize(out: Mat, vec: Operand): Mat {
    const len = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]);

    out[0] = vec[0] / len;
    out[1] = vec[1] / len;
    out[2] = vec[2] / len;

    return out;
  }
}
