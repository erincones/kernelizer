import { useRef, useCallback, useEffect, CSSProperties, WheelEvent } from "react";

import { Picture } from "../lib/picture";


/**
 * Canvas component properties
 */
interface Props {
  readonly pic?: Picture;
  readonly scaleFactor?: number;
  readonly scale?: number;
  readonly fit?: boolean;
  readonly background?: CSSProperties["background"];
  readonly onScaleChange?: (scale: number, min?: number) => unknown;
}


/**
 * Canvas component
 *
 * @param props Canvas component properties
 */
export const Canvas = ({ pic, scaleFactor = 1.25, scale = 1, fit = true, background, onScaleChange }: Props): JSX.Element => {
  const container = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);


  // Wheel handler
  const handleWheel = useCallback((e: WheelEvent<HTMLDivElement>) => {
    onScaleChange?.(e.deltaY < 0 ? scale * scaleFactor : scale / scaleFactor);
  }, [ onScaleChange, scale, scaleFactor ]);


  // Handle container resize
  useEffect(() => {
    const handleResize = () => {
      if (!pic) return;

      const cnt = container.current as HTMLDivElement;
      const scaleMin = Math.min(1, cnt.offsetWidth / pic.image.width, cnt.offsetHeight / pic.image.height);

      onScaleChange?.(fit ? scaleMin : scale, scaleMin);
    };

    handleResize();

    window.addEventListener(`resize`, handleResize, true);
    return () => window.removeEventListener(`resize`, handleResize, true);
  }, [ onScaleChange, pic, scale, fit ]);

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
    const cnt = container.current as HTMLDivElement;
    const img = pic.image;

    // Scale
    const w = Math.trunc(img.width * scale);
    const h = Math.trunc(img.height * scale);

    // Center
    const width = cnt.offsetWidth;
    const height = cnt.offsetHeight;
    const left = (width - w) >> 1;
    const top = (height - h) >> 1;

    cnv.style.left = `${left}px`;
    cnv.style.top = `${top}px`;


    // Repaint context
    if ((cnv.width !== w) || (cnv.height !== h)) {
      const ctx = cnv.getContext(`2d`) as CanvasRenderingContext2D;

      cnv.width = w;
      cnv.height = h;
      ctx.putImageData(pic.scale(scale, scale).image, 0, 0);
    }
  }, [ pic, scale ]);


  // Return canvas
  return (
    <div ref={container} onWheel={handleWheel} className="relative overflow-hidden w-full h-full" style={{ background }}>
      <canvas ref={canvas} className="absolute" />
    </div>
  );
};
