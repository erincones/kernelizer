import { useRef, useState, useCallback, useEffect, MutableRefObject, WheelEvent } from "react";

import { GLSLPlane, GLSLProgram, GLSLShader, GLSLTexture2D } from "../../lib/glsl";
import { Mat4 } from "../../lib/linear";

import IMG_VERT from "../../shaders/image.vert";
import IMG_FRAG from "../../shaders/image.frag";

import { SCALE_FACTOR, MAX_SCALE } from "./scale";
import { WHITE, hexToRGBA } from "./color";

import { Error } from "./error";


/**
 * Canvas component properties
 */
interface Props {
  readonly img?: HTMLImageElement;
  readonly background?: string;
  readonly grid0?: string;
  readonly grid1?: string;
  readonly onScaleChange?: (scale: number, min?: number, max?: number) => unknown;
}


/**
 * Canvas component
 *
 * @param props Canvas component properties
 */
export const Canvas = ({ img: pic, background = `#FFFFFF`, grid0 = background, grid1 = grid0, onScaleChange }: Props): JSX.Element => {
  const container = useRef() as MutableRefObject<HTMLDivElement>;
  const canvas = useRef() as MutableRefObject<HTMLCanvasElement>;
  const ctx = useRef() as MutableRefObject<WebGL2RenderingContext>;

  const program = useRef() as MutableRefObject<GLSLProgram>;
  const texture = useRef() as MutableRefObject<GLSLTexture2D>;

  const [ viewport, setViewport ] = useState({ width: 1, height: 1 });
  const [ minScale, setMinScale ] = useState(1);
  const [ scale, setScale ] = useState(1);

  const [ error, setError ] = useState<ReadonlyArray<string>>([]);


  // Wheel handler
  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    setScale(scale => {
      const scaled = e.deltaY < 0 ?
        scale * SCALE_FACTOR :
        scale / SCALE_FACTOR;

      return Math.max(minScale, Math.min(MAX_SCALE, scaled));
    });
  };

  // Close error handler
  const handleCloseError = useCallback(() => { setError([]); }, []);


  // Setup canvas
  useEffect(() => {
    // Error handler function
    const onerror = (error: string) => { setError(errors => errors.concat(error)); };

    // Initialize context
    ctx.current = canvas.current.getContext(`webgl2`, { alpha: false }) as never;
    const gl = ctx.current;

    // Image program
    const vert = new GLSLShader(gl, gl.VERTEX_SHADER, IMG_VERT, onerror);
    const frag = new GLSLShader(gl, gl.FRAGMENT_SHADER, IMG_FRAG, onerror);
    const prog = new GLSLProgram(gl, vert, frag, onerror);
    prog.deleteShaders();
    program.current = prog;

    // Create texture
    const tex = new GLSLTexture2D(gl, null, 0, onerror);
    texture.current = tex;

    // Create square
    GLSLPlane.load(gl, onerror);


    // Viewport size management
    const cnt = container.current;
    const resizeHandler = () => {
      setViewport({ width: cnt.offsetWidth, height: cnt.offsetHeight });
    };

    resizeHandler();
    window.addEventListener(`resize`, resizeHandler, true);


    // Clean up
    return () => {
      window.addEventListener(`resize`, resizeHandler, true);

      prog.delete();

      GLSLPlane.delete(gl);
      tex.delete();

      setError([]);
    };
  }, []);

  // Update image
  useEffect(() => {
    texture.current.updateImageSource(pic);
  }, [ pic ]);

  // Update minimum zoom
  useEffect(() => {
    // Minimize canvas for undefined image
    if (!pic) return;

    // Update minimum scale
    const ratioW = viewport.width / pic.width;
    const ratioH = viewport.height / pic.height;
    const scaleMin = Math.min(1, ratioW, ratioH);

    setMinScale(scaleMin);
    setScale(scale => scale < scaleMin ? scaleMin : scale);

    // Model matrix
    const w = scaleMin / ratioW;
    const h = scaleMin / ratioH;
    const dx = viewport.width - (scaleMin * pic.width);
    const dy = viewport.height - (scaleMin * pic.height);
    const matrix = Mat4.identity();

    Mat4.translate(matrix, matrix, [ dx % 2 ? 1 / viewport.width : 0, dy % 2 ? 1 / viewport.height : 0, 0 ]);
    Mat4.scale(matrix, matrix, [ w, h, 1 ]);

    // Resize viewport
    const gl = ctx.current;
    const prog = program.current;

    gl.viewport(0, 0, viewport.width, viewport.height);

    // Set uniforms
    prog.use();
    gl.uniform2f(prog.getLocation(`u_offset`), dx / 2, viewport.height - dy / 2);
    gl.uniformMatrix4fv(prog.getLocation(`u_matrix`), false, matrix);
  }, [ pic, viewport ]);

  // Update background
  useEffect(() => {
    const gl = ctx.current;
    const prog = program.current;

    // Parse colors
    const back = hexToRGBA(background) || WHITE;

    const color0 =
      background === grid0 ? back :
      hexToRGBA(grid0) || WHITE;

    const color1 =
      background === grid1 ? back :
      grid0 === grid1 ? color0 :
      hexToRGBA(grid1) || WHITE;

    // Update colors
    gl.clearColor(...back);

    prog.use();
    gl.uniform3f(prog.getLocation(`u_grid0`), color0[0], color0[1], color0[2]);
    gl.uniform3f(prog.getLocation(`u_grid1`), color1[0], color1[1], color1[2]);
  }, [ background, grid0, grid1 ]);

  // Trigger scale change
  useEffect(() => {
    onScaleChange?.(scale, minScale, MAX_SCALE);
  }, [ onScaleChange, scale, minScale ]);

  // Repaint context at render
  useEffect(() => {
    // Reset
    const gl = ctx.current;
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw image
    program.current.use();
    GLSLPlane.draw(gl);
  });


  // Return canvas
  return (
    <div
      ref={container}
      onWheel={handleWheel}
      className="relative overflow-hidden w-full h-full"
    >
      <canvas
        ref={canvas}
        width={viewport.width}
        height={viewport.height}
        className="absolute top-0 left-0"
      >
        Your browser does not support the canvas tag.
      </canvas>
      <Error onClose={handleCloseError}>
        {error}
      </Error>
    </div>
  );
};
