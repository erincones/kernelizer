import { forwardRef, useRef, useImperativeHandle, useEffect, CSSProperties } from "react";

import { Picture } from "../lib/picture";


/**
 * Canvas component properties
 */
interface Props {
  readonly pic?: Picture;
  readonly scale?: `fit` | `original` | number;
  readonly background?: CSSProperties["background"];
}

/**
 * Canvas element
 */
export interface CanvasElement {
  readonly element: HTMLCanvasElement | null;
}


/**
 * Canvas component
 *
 * @param props Canvas component properties
 */
export const Canvas = forwardRef<CanvasElement, Props>(({ pic, scale = `fit`, background }: Props, ref): JSX.Element => {
  const container = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);


  // Setup canvas ref
  useImperativeHandle(ref, () => ({
    element: canvas.current
  }), []);


  // Scale image
  useEffect(() => {
    // Canvas
    const cnv = canvas.current as HTMLCanvasElement;

    // Validate picture
    if (!pic) {
      cnv.width = 0;
      cnv.height = 0;
      cnv.style.left = ``;
      cnv.style.top = ``;
      return;
    }


    // Elements
    const div = container.current as HTMLDivElement;
    const ctx = cnv.getContext(`2d`) as CanvasRenderingContext2D;
    const img = pic.image;


    // Scale
    const zoom =
      scale === `fit` ? Math.min(1, div.offsetWidth / img.width, div.offsetHeight / img.height) :
      scale === `original` ? 1 :
      scale;

    const width = Math.trunc(img.width * zoom);
    const height = Math.trunc(img.height * zoom);

    // Center
    const left = Math.trunc(div.offsetWidth - width) >> 1;
    const top = Math.trunc(div.offsetHeight - height) >> 1;

    cnv.style.left = `${Math.max(left, 0)}px`;
    cnv.style.top = `${Math.max(top, 0)}px`;


    // Repaint context
    cnv.width = width;
    cnv.height = height;
    ctx.putImageData(pic.scale(zoom, zoom).image, 0, 0);

    // Scroll if necessary
    if (left < 0) div.scrollLeft = -left;
    if (top < 0) div.scrollTop = -top;
  }, [ scale, pic ]);


  // Return canvas
  return (
    <div ref={container} className="relative overflow-auto w-full h-full" style={{ background }}>
      <canvas ref={canvas} className="absolute" />
    </div>
  );
});

Canvas.displayName = `Canvas`;
