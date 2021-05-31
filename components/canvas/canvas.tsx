import { useRef, useReducer, useState, useCallback, useEffect, MutableRefObject, MouseEventHandler, WheelEventHandler } from "react";

import { canvasReducer, initialCanvas } from "../../reducers/canvas";

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

/** Plane point */
interface Point {
  readonly x: number;
  readonly y: number;
}


/**
 * Canvas component
 *
 * @param props Canvas component properties
 */
export const Canvas = ({ img, background = `#FFFFFF`, grid0 = background, grid1 = grid0, onScaleChange }: Props): JSX.Element => {
  const container = useRef() as MutableRefObject<HTMLDivElement>;
  const canvas = useRef() as MutableRefObject<HTMLCanvasElement>;
  const css = useRef() as MutableRefObject<HTMLStyleElement>;

  const [ { scale, scaleMin, scaleMax, errors }, dispatch ] = useReducer(canvasReducer, initialCanvas);
  const [, setMouse ] = useState<Point>();


  // Mouse down handler
  const handleMouseDown: MouseEventHandler<HTMLDivElement> = useCallback(e => {
    e.preventDefault();

    if (e.buttons === 1) {
      css.current.textContent = `* { cursor: grabbing !important }`;
      setMouse({ x: e.clientX, y: e.clientY });
    }
  }, []);

  // Wheel handler
  const handleWheel: WheelEventHandler<HTMLDivElement> = useCallback(e => {
    dispatch({
      type: e.deltaY < 0 ? `ZOOM_IN` : `ZOOM_OUT`,
      x: e.pageX - e.currentTarget.offsetLeft,
      y: e.pageY - e.currentTarget.offsetTop
    });
  }, []);

  // Close error handler
  const handleCloseError = useCallback(() => {
    dispatch({ type: `CLOSE_ERRORS` }); }
  , []);


  // Setup canvas
  useEffect(() => {
    dispatch({
      type: `INITIALIZE`,
      container: container.current,
      canvas: canvas.current
    });

    // Get global css
    css.current = document.getElementById(`__global_css`) as HTMLStyleElement;


    // Viewport size management
    const resizeHandler = () => { dispatch({ type: `RESIZE` }); };

    // Mouse up handler
    const handleMouseUp = () => {
      css.current.textContent = ``;
      setMouse(undefined);
      dispatch({ type: `CLAMP_POSITION` });
    };

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();

      if (e.buttons === 1) {
        setMouse(point => {
          if (!point) return undefined;

          const mouse = { x: e.clientX, y: e.clientY };
          const dx = mouse.x - point.x;
          const dy = mouse.y - point.y;

          if (dx || dy) {
            dispatch({ type: `TRANSLATE`, dx, dy });
          }

          return mouse;
        });
      }
    };

    window.addEventListener(`resize`, resizeHandler, true);
    window.addEventListener(`mouseup`, handleMouseUp, true);
    window.addEventListener(`mousemove`, handleMouseMove, true);

    // Clean up
    return () => {
      window.removeEventListener(`resize`, resizeHandler, true);
      window.removeEventListener(`mouseup`, handleMouseUp, true);
      window.removeEventListener(`mousemove`, handleMouseMove, true);

      dispatch({ type: `CLEAN_UP` });
    };
  }, []);

  // Update image
  useEffect(() => {
    dispatch({ type: `SET_IMAGE`, img });
  }, [ img ]);

  // Update background
  useEffect(() => {
    dispatch({ type: `SET_BACKGROUND`, background, grid0, grid1 });
  }, [ background, grid0, grid1 ]);

  // Trigger scale change
  useEffect(() => {
    onScaleChange?.(scale, scaleMin, scaleMax);
  }, [ onScaleChange, scale, scaleMin, scaleMax ]);


  // Return canvas
  return (
    <div
      ref={container}
      onMouseDown={img ? handleMouseDown : undefined}
      onWheel={img ? handleWheel : undefined}
      className="relative overflow-hidden w-full h-full"
    >
      <canvas ref={canvas} className={`${img ? `cursor-grab ` : ``}absolute top-0 left-0`}>
        Your browser does not support the canvas tag.
      </canvas>
      <Error onClose={handleCloseError}>
        {errors}
      </Error>
    </div>
  );
};
