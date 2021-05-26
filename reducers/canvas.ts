import { GLSLShader, GLSLProgram, GLSLTexture2D, GLSLPlane } from "../lib/glsl";
import { Mat4 } from "../lib/linear";

import { hexToRGBA, WHITE, RGBA } from "../helpers/color";

import IMG_VERT from "../shaders/image.vert";
import IMG_FRAG from "../shaders/image.frag";


/** Canvas state */
interface State {
  readonly container: HTMLDivElement;
  readonly canvas: HTMLCanvasElement;
  readonly gl: WebGL2RenderingContext;

  readonly program: GLSLProgram;
  readonly texture: GLSLTexture2D;
  readonly plane: GLSLPlane;

  readonly background: RGBA;
  readonly grid0: RGBA;
  readonly grid1: RGBA;

  readonly img?: HTMLImageElement;
  readonly fitted: boolean;
  readonly x: number;
  readonly y: number;
  readonly scale: number;
  readonly scaleMin: number;
  readonly scaleMax: number;

  readonly errors: ReadonlyArray<string>;
}

/** Canvas action */
type Action = {
  readonly type: `INITIALIZE`;
  readonly container: HTMLDivElement;
  readonly canvas: HTMLCanvasElement;
} | {
  readonly type: `RESIZE`;
} | {
  readonly type: `SET_IMAGE`;
  readonly img?: HTMLImageElement;
} | {
  readonly type: `SET_BACKGROUND`;
  readonly background: string;
  readonly grid0?: string;
  readonly grid1?: string;
} | {
  readonly type: `FIT`;
} | {
  readonly type: `TRANSLATE`;
  readonly x: number;
  readonly y: number;
} | {
  readonly type: `SCALE`;
  readonly scale: number;
} | {
  readonly type: `ZOOM_IN`;
} | {
  readonly type: `ZOOM_OUT`;
} | {
  readonly type: `CLOSE_ERRORS`;
} | {
  readonly type: `CLEAN_UP`;
};


/** Scale factor */
const SCALE_FACTOR = 1.25;


/**
 * Render the image.
 *
 * @param state Current state
 * @returns Next state
 */
const render = (state: State): State => {
  const { gl, container, program, plane, img, x, y, scale } = state;

  // Reset context
  gl.clear(gl.COLOR_BUFFER_BIT);
  program.use();

  // Render image
  if (img) {
    // Model matrix
    const matrix = Mat4.identity();
    const dx = Math.ceil(x);
    const dy = Math.ceil(y);
    const w = scale * img.width / container.offsetWidth;
    const h = scale * img.height / container.offsetHeight;

    Mat4.translate(matrix, matrix, [ dx * 2 / container.offsetWidth + w - 1, 1 - h - dy * 2 / container.offsetHeight, 0 ]);
    Mat4.scale(matrix, matrix, [ w, h, 1 ]);

    // Set uniforms
    gl.uniform2f(program.getLocation(`u_offset`), dx, container.offsetHeight - dy);
    gl.uniformMatrix4fv(program.getLocation(`u_matrix`), false, matrix);

    // Draw plane
    plane.draw();
  }

  // Return state
  return state;
};


/**
 * Initialize canvas state.
 *
 * @param container Canvas container
 * @param canvas Canvas element
 * @param background Background color
 * @param grid0 First grid color
 * @param grid1 Second grid color
 * @returns Next state
 */
const initialize = (container: HTMLDivElement, canvas: HTMLCanvasElement): State => {
  // Error handler function
  const errors: string[] = [];
  const onerror = (error: string) => { errors.concat(error); };

  // Initialize context
  const gl = canvas.getContext(`webgl2`, { alpha: false }) as WebGL2RenderingContext;

  // Image program
  const vert = new GLSLShader(gl, gl.VERTEX_SHADER, IMG_VERT, onerror);
  const frag = new GLSLShader(gl, gl.FRAGMENT_SHADER, IMG_FRAG, onerror);
  const program = new GLSLProgram(gl, vert, frag, onerror);
  program.deleteShaders();

  // Create texture and plane
  const texture = new GLSLTexture2D(gl, null, 0, onerror);
  const plane = new GLSLPlane(gl, onerror);

  // Resize viewport
  gl.viewport(0, 0, container.offsetWidth, container.offsetHeight);
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;

  return render({
    container,
    canvas,
    gl,
    program,
    texture,
    plane,
    background: WHITE,
    grid0: WHITE,
    grid1: WHITE,
    fitted: false,
    x: 0,
    y: 0,
    scale: 1,
    scaleMin: 1,
    scaleMax: 20,
    errors
  });
};

/**
 * Resize the container.
 *
 * @param state Current state
 * @returns Next state
 */
const resize = (state: State): State => {
  const { gl, container, canvas, img, fitted, scale } = state;

  // Resize viewport
  gl.viewport(0, 0, container.offsetWidth, container.offsetHeight);

  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;

  // Update scale and position
  if (img) {
    const scaleMin = Math.min(1, container.offsetWidth / img.width, container.offsetHeight / img.height);
    const scaleNew = fitted || (scale < scaleMin) ? scaleMin : scale;

    return render({
      ...state,
      x: (container.offsetWidth - scaleNew * img.width) / 2,
      y: (container.offsetHeight - scaleNew * img.height) / 2,
      scaleMin,
      scale: scaleNew
    });
  }

  return render(state);
};

/**
 * Update image.
 *
 * @param state Current state
 * @param img New image
 * @returns Next state
 */
const setImage = (state: State, img?: HTMLImageElement): State => {
  // Remove image
  if (!img) {
    state.texture.delete();

    return render({ ...state, img });
  }

  // Update image
  const { container, texture } = state;
  const scale = Math.min(1, container.offsetWidth / img.width, container.offsetHeight / img.height);

  texture.updateImageSource(img);

  return render({
    ...state,
    img,
    fitted: true,
    x: (container.offsetWidth - scale * img.width) / 2,
    y: (container.offsetHeight - scale * img.height) / 2,
    scale,
    scaleMin: scale
  });
};

/**
 * Update the background colors.
 *
 * @param state Current state
 * @param bg Background color
 * @param g0 First grid color
 * @param g1 Second grid color
 */
const setBackground = (state: State, bg: string, g0 = bg, g1 = g0): State => {
  const { gl, program } = state;

  // Parse colors
  const background = hexToRGBA(bg) || WHITE;
  const grid0 = bg === g0 ? background : hexToRGBA(g0) || WHITE;
  const grid1 = bg === g1 ? background : g0 === g1 ? grid0 : hexToRGBA(g1) || WHITE;

  // Update colors
  gl.clearColor(background[0], background[1], background[2], background[3]);

  program.use();
  gl.uniform3f(program.getLocation(`u_grid0`), grid0[0], grid0[1], grid0[2]);
  gl.uniform3f(program.getLocation(`u_grid1`), grid1[0], grid1[1], grid1[2]);

  return render({
    ...state,
    background,
    grid0,
    grid1
  });
};

/**
 * Scale the image.
 *
 * @param state Current state
 * @param scale New scale
 * @returns Next state
 */
const scale = (state: State, scale: number): State => {
  const { container, img, scaleMin, scaleMax } = state;
  const scaleNew = Math.min(scaleMax, Math.max(scaleMin, scale));

  if (img && (state.scale !== scaleNew)) {
    return render({
      ...state,
      fitted: false,
      x: (container.offsetWidth - scaleNew * img.width) / 2,
      y: (container.offsetHeight - scaleNew * img.height) / 2,
      scale: scaleNew
    });
  }

  return state;
};


/** Initial canvas state */
export const initialCanvas: State = {
  container: null as never,
  canvas: null as never,
  gl: null as never,
  program: null as never,
  texture: null as never,
  plane: null as never,
  background: WHITE,
  grid0: WHITE,
  grid1: WHITE,
  fitted: false,
  x: 0,
  y: 0,
  scale: 1,
  scaleMin: 1,
  scaleMax: 20,
  errors: []
};

/**
 * Canvas reducer
 *
 * @param state Current state
 * @param action Action
 * @returns Next state
 */
export const canvasReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case `INITIALIZE`: return initialize(action.container, action.canvas);
    case `RESIZE`: return resize(state);

    case `SET_IMAGE`: return setImage(state, action.img);
    case `SET_BACKGROUND`: return setBackground(state, action.background, action.grid0, action.grid1);

    case `ZOOM_IN`: return scale(state, state.scale * SCALE_FACTOR);
    case `ZOOM_OUT`: return scale(state, state.scale / SCALE_FACTOR);
    case `SCALE`: return scale(state, action.scale);

    default: return state;
  }
};
