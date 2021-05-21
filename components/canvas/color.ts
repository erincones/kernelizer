/** Color type */
type RGBA = Readonly<[ number, number, number, number ]>;


/** Black */
export const BLACK: RGBA = new Float32Array([ 0, 0, 0, 1 ]) as never;

/** White */
export const WHITE: RGBA = new Float32Array([ 1, 1, 1, 1 ]) as never;


/** Hexadecimal regex */
const HEX = /^#([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/;

/** Hexadecimal short regex */
const HEX_SHORT = /^#([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/;


/**
 * Parse hexadecimal color to RGBA color.
 *
 * @param hex Hexadecimal color
 * @returns RGBA color
 */
export const hexToRGBA = (hex: string): RGBA | null => {
  const color = hex.match(HEX) || hex.match(HEX_SHORT);
  return color && new Float32Array(color.slice(1).map(ch => Number.parseInt(ch, 16) / 255).concat(1)) as never;
};
