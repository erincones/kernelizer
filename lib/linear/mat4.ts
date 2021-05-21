import { Mat } from "./linear";


/**
 * 4x4 matrix.
 */
export class Mat4 {
  /** Zero 4x4 matrix */
  public static zero(): Mat {
    return new Mat(16);
  }

  /** Identity 4x4 matrix */
  public static identity(): Mat {
    return new Mat([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  }

  /**
   * Multiply the given matrices.
   *
   * @param out Destination
   * @param a First matrix
   * @param b Second matrix
   * @returns 4x4 matrix
   */
  public static dot(out: Mat, a: Operand, b: Operand): Mat {
    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a03 = a[3];
    const a10 = a[4];
    const a11 = a[5];
    const a12 = a[6];
    const a13 = a[7];
    const a20 = a[8];
    const a21 = a[9];
    const a22 = a[10];
    const a23 = a[11];
    const a30 = a[12];
    const a31 = a[13];
    const a32 = a[14];
    const a33 = a[15];

    let b0 = b[0];
    let b1 = b[1];
    let b2 = b[2];
    let b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    return out;
  }

  /**
   * Creates an orthogonal projection matrix.
   *
   * @param out Destination
   * @param left Left bound of the frustum
   * @param right Right bound of the frustum
   * @param top Top bound of the frustum
   * @param bottom Bottom bound of the frustum
   * @param near Near bound of the frustum
   * @param far Far bound of the frustum
   * @returns Orthogonal projection matrix
   */
  public static ortho(out: Mat, left: number, right: number, top: number, bottom: number, near: number, far: number): Mat {
    const lr = 1 / (left - right);
    const bt = 1 / (bottom - top);
    const nf = 1 / (near - far);

    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;

    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;

    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;

    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;

    return out;
  }

  /**
   * Creates a 4x4 scaling matrix from the given vector.
   *
   * @param out Destination
   * @param vec Scaling vector
   * @returns 4x4 scaling matrix
   */
  public static scaling(out: Mat, vec: Operand): Mat {
    out[0] = vec[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;

    out[4] = 0;
    out[5] = vec[1];
    out[6] = 0;
    out[7] = 0;

    out[8] = 0;
    out[9] = 0;
    out[10] = vec[2];
    out[11] = 0;

    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;

    return out;
  }

  /**
   * Creates a 4x4 translation matrix from the given vector.
   *
   * @param out Destination
   * @param vec Translation vector
   * @returns 4x4 translation matrix
   */
  public static translation(out: Mat, vec: Operand): Mat {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;

    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;

    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;

    out[12] = vec[0];
    out[13] = vec[1];
    out[14] = vec[2];
    out[15] = 1;

    return out;
  }

  /**
   * Creates a 4x4 rotation matrix from the given angle around the Z axis.
   *
   * @param out Destination
   * @param rad Angle
   * @returns 4x4 rotation matrix
   */
  public static rotationZ(out: Mat, rad: number): Mat {
    const s = Math.sin(rad);
    const c = Math.cos(rad);

    out[0] = c;
    out[1] = s;
    out[2] = 0;
    out[3] = 0;

    out[4] = -s;
    out[5] = c;
    out[6] = 0;
    out[7] = 0;

    out[8] = 1;
    out[9] = 0;
    out[10] = 0;
    out[11] = 0;

    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;

    return out;
  }


  /**
   * Scale the given matrix with the given vector.
   *
   * @param out Destination
   * @param mat Matrix to scale
   * @param vec Scale vector
   * @returns 4x4 matrix
   */
  public static scale(out: Mat, mat: Operand, vec: Operand): Mat {
    const x = vec[0];
    const y = vec[1];
    const z = vec[2];

    out[0] = mat[0] * x;
    out[1] = mat[1] * x;
    out[2] = mat[2] * x;
    out[3] = mat[3] * x;

    out[4] = mat[4] * y;
    out[5] = mat[5] * y;
    out[6] = mat[6] * y;
    out[7] = mat[7] * y;

    out[8] = mat[8] * z;
    out[9] = mat[9] * z;
    out[10] = mat[10] * z;
    out[11] = mat[11] * z;

    out[12] = mat[12];
    out[13] = mat[13];
    out[14] = mat[14];
    out[15] = mat[15];

    return out;
  }


  /**
   * Translate the given matrix with the given vector.
   *
   * @param out Destination
   * @param mat Matrix to translate
   * @param vec Translate vector
   * @returns 4x4 matrix
   */
  public static translate(out: Mat, mat: Operand, vec: Operand): Mat {
    const x = vec[0];
    const y = vec[1];
    const z = vec[2];

    if (mat === out) {
      out[12] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12];
      out[13] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13];
      out[14] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14];
      out[15] = mat[3] * x + mat[7] * y + mat[11] * z + mat[15];
    }
    else {
      const a00 = mat[0];
      const a01 = mat[1];
      const a02 = mat[2];
      const a03 = mat[3];

      const a10 = mat[4];
      const a11 = mat[5];
      const a12 = mat[6];
      const a13 = mat[7];

      const a20 = mat[8];
      const a21 = mat[9];
      const a22 = mat[10];
      const a23 = mat[11];

      out[0] = a00;
      out[1] = a01;
      out[2] = a02;
      out[3] = a03;
      out[4] = a10;

      out[5] = a11;
      out[6] = a12;
      out[7] = a13;
      out[8] = a20;

      out[9] = a21;
      out[10] = a22;
      out[11] = a23;
      out[12] = a00 * x + a10 * y + a20 * z + mat[12];

      out[13] = a01 * x + a11 * y + a21 * z + mat[13];
      out[14] = a02 * x + a12 * y + a22 * z + mat[14];
      out[15] = a03 * x + a13 * y + a23 * z + mat[15];
    }

    return out;
  }


  /**
   * Rotate the given matrix from the given angle around the Z axis.
   *
   * @param out Destination
   * @param mat Matrix to rotate
   * @param rad Angle
   * @returns 4x4 matrix
   */
  public static rotateZ(out: Mat, mat: Operand, rad: number): Mat {
    const s = Math.sin(rad);
    const c = Math.cos(rad);

    const a00 = mat[0];
    const a01 = mat[1];
    const a02 = mat[2];
    const a03 = mat[3];

    const a10 = mat[4];
    const a11 = mat[5];
    const a12 = mat[6];
    const a13 = mat[7];

    if (mat !== out) {
      out[8] = mat[8];
      out[9] = mat[9];
      out[10] = mat[10];
      out[11] = mat[11];
      out[12] = mat[12];
      out[13] = mat[13];
      out[14] = mat[14];
      out[15] = mat[15];
    }

    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;

    return out;
  }
}
