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


  // Update picture
  useEffect(() => {
    // Validate picture
    const cnv = canvas.current as HTMLCanvasElement;

    if (!pic) {
      cnv.width = 0;
      cnv.height = 0;
      cnv.style.transform = ``;
      return;
    }

    // Update picture
    const ctx = cnv.getContext(`2d`) as CanvasRenderingContext2D;
    cnv.width = pic.image.width;
    cnv.height = pic.image.height;
    ctx.putImageData(pic.image, 0, 0);
  }, [ pic ]);

  // Scale picture
  useEffect(() => {
    const cnt = container.current as HTMLDivElement;
    const cnv = canvas.current as HTMLCanvasElement;

    const dx = (cnt.offsetWidth - Math.trunc(cnv.width * scale)) >> 1;
    const dy = (cnt.offsetHeight - Math.trunc(cnv.height * scale)) >> 1;

    cnv.style.transformOrigin = `0 0`;
    cnv.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
    cnv.style.imageRendering = scale > 1 ? `crisp-edges` : ``;
  }, [ scale ]);


  // Return canvas
  return (
    <div ref={container} onWheel={handleWheel} className="overflow-hidden w-full h-full" style={{ background }}>
      <canvas ref={canvas} />
    </div>
  );
};
