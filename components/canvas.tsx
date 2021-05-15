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


  // Update image
  useEffect(() => {
    const cnv = canvas.current as HTMLCanvasElement;
    const ctx = cnv.getContext(`2d`) as CanvasRenderingContext2D;

    if (pic) {
      const img = pic.image;
      cnv.width = img.width;
      cnv.height = img.height;
      ctx.putImageData(img, 0, 0);
    }
    else {
      cnv.width = 0;
      cnv.height = 0;
      ctx.clearRect(0, 0, cnv.width, cnv.height);
    }
  }, [ pic ]);

  // Scale image
  useEffect(() => {
    if (!pic) return;

    // Elements
    const div = container.current as HTMLDivElement;
    const cnv = canvas.current as HTMLCanvasElement;
    const ctx = cnv.getContext(`2d`) as CanvasRenderingContext2D;

    // Scale
    const divRect = div.getBoundingClientRect();
    const zoom = Math.min(1, divRect.width / cnv.width, divRect.height / cnv.height);

    cnv.width = Math.trunc(cnv.width * zoom);
    cnv.height = Math.trunc(cnv.height * zoom);

    // Center
    cnv.style.left = `${Math.trunc((divRect.width - cnv.width) / 2)}px`;
    cnv.style.top = `${Math.trunc((divRect.height - cnv.height) / 2)}px`;


    // Repaint context
    ctx.putImageData(pic.image, 0, 0);
  }, [ scale, pic ]);


  // Overflow
  const overflow = (scale === `fit`) || (scale < 0) ? `overflow-hidden ` : ``;

  // Return canvas
  return (
    <div ref={container} className={`${overflow}relative w-full h-full`} style={{ background }}>
      <canvas ref={canvas} className="absolute" />
    </div>
  );
});

Canvas.displayName = `Canvas`;
