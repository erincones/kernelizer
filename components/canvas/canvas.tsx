import { useRef, useState, useCallback, useEffect, MutableRefObject, WheelEvent } from "react";

import { GLSLPlane, GLSLProgram, GLSLShader, GLSLTexture2D } from "../../lib/glsl";

import BG_VERT from "../../shaders/background.vert";
import BG_FRAG from "../../shaders/background.frag";
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
  readonly foreground?: string;
  readonly background?: string;
  readonly onScaleChange?: (scale: number, min?: number, max?: number) => unknown;
}


/**
 * Canvas component
 *
 * @param props Canvas component properties
 */
export const Canvas = ({ img: pic, foreground = `#FFFFFF`, background = `#DBDBDB`, onScaleChange }: Props): JSX.Element => {
  const container = useRef() as MutableRefObject<HTMLDivElement>;
  const canvas = useRef() as MutableRefObject<HTMLCanvasElement>;
  const ctx = useRef() as MutableRefObject<WebGL2RenderingContext>;

  const [ bgProgram, setBgProgram ] = useState<GLSLProgram>();
  const [ imgProgram, setImgProgram ] = useState<GLSLProgram>();
  const [ texture, setTexture ] = useState<GLSLTexture2D>();

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

    // Setup blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Background program
    const bgVert = new GLSLShader(gl, gl.VERTEX_SHADER, BG_VERT, onerror);
    const bgFrag = new GLSLShader(gl, gl.FRAGMENT_SHADER, BG_FRAG, onerror);
    const bgProgram = new GLSLProgram(gl, bgVert, bgFrag, onerror);
    bgProgram.deleteShaders();
    setBgProgram(bgProgram);

    // Image program
    const imgVert = new GLSLShader(gl, gl.VERTEX_SHADER, IMG_VERT, onerror);
    const imgFrag = new GLSLShader(gl, gl.FRAGMENT_SHADER, IMG_FRAG, onerror);
    const imgProgram = new GLSLProgram(gl, imgVert, imgFrag, onerror);
    imgProgram.deleteShaders();
    setImgProgram(imgProgram);

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

      bgProgram.delete();
      imgProgram.delete();

      GLSLPlane.delete(gl);

      setTexture(texture => {
        texture?.delete();
        return undefined;
      });

      setError([]);
    };
  }, []);

  // Update image
  useEffect(() => {
    setTexture(texture => {
      if (texture) {
        texture.updateImageSource(pic);
        return texture;
      }

      const gl = ctx.current;
      return new GLSLTexture2D(gl, pic, 0, error => { setError(errors => errors.concat(error)); });
    });
  }, [ pic ]);

  // Update minimum zoom
  useEffect(() => {
    // Minimize canvas for undefined image
    if (!pic) return;

    // Update minimum scale
    const scaleMin = Math.min(1, viewport.width / pic.width, viewport.height / pic.height);
    setMinScale(scaleMin);
    setScale(scale => scale < scaleMin ? scaleMin : scale);

    // Resize viewport
    const gl = ctx.current;
    gl.viewport(0, 0, viewport.width, viewport.height);

    if (bgProgram) {
      bgProgram.use();
      gl.uniform2f(bgProgram.getLocation(`viewport`), viewport.width, viewport.height);
    }
  }, [ pic, bgProgram, viewport ]);

  // Update background
  useEffect(() => {
    const gl = ctx.current;

    // Foreground color
    const foreColor = hexToRGBA(foreground) || WHITE;
    gl.clearColor(...foreColor);

    // Background color
    if (bgProgram) {
      bgProgram.use();
      gl.uniform4fv(bgProgram.getLocation(`fore`), foreColor);
      gl.uniform4fv(bgProgram.getLocation(`back`), hexToRGBA(background) || WHITE);
    }
  }, [ bgProgram, foreground, background ]);

  // Trigger scale change
  useEffect(() => {
    onScaleChange?.(scale, minScale, MAX_SCALE);
  }, [ onScaleChange, scale, minScale ]);

  // Repaint context at render
  useEffect(() => {
    if (!bgProgram || !imgProgram) return;

    const gl = ctx.current;
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw background
    if (foreground !== background) {
      bgProgram.use();
      GLSLPlane.draw(gl);
      imgProgram.use();
    }

    // Draw image
    if (texture?.status) GLSLPlane.draw(gl);
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
