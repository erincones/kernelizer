import { useRef, useReducer, useCallback, useEffect, MutableRefObject, WheelEvent } from "react";

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


/**
 * Canvas component
 *
 * @param props Canvas component properties
 */
export const Canvas = ({ img, background = `#FFFFFF`, grid0 = background, grid1 = grid0, onScaleChange }: Props): JSX.Element => {
  const container = useRef() as MutableRefObject<HTMLDivElement>;
  const canvas = useRef() as MutableRefObject<HTMLCanvasElement>;

  const [ { scale, scaleMin, scaleMax, errors }, dispatch ] = useReducer(canvasReducer, initialCanvas);


  // Wheel handler
  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    dispatch({ type: e.deltaY < 0 ? `ZOOM_IN` : `ZOOM_OUT` });
  };

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

    // Viewport size management
    const resizeHandler = () => { dispatch({ type: `RESIZE` }); };

    window.addEventListener(`resize`, resizeHandler, true);

    // Clean up
    return () => {
      window.addEventListener(`resize`, resizeHandler, true);
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
      onWheel={handleWheel}
      className="relative overflow-hidden w-full h-full"
    >
      <canvas ref={canvas} className="absolute top-0 left-0">
        Your browser does not support the canvas tag.
      </canvas>
      <Error onClose={handleCloseError}>
        {errors}
      </Error>
    </div>
  );
};
