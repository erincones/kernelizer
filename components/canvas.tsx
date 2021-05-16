import { useRef, useState, useCallback, useEffect, CSSProperties, WheelEvent } from "react";

import { Picture } from "../lib/picture";


/**
 * Canvas component properties
 */
interface Props {
  readonly pic?: Picture;
  readonly fit?: boolean;
  readonly scale?: number;
  readonly background?: CSSProperties["background"];
}

/** Maximum zoom */
const MAX_ZOOM = 20;

/** Zoom step */
const ZOOM_STEP = 1.25;


/**
 * Canvas component
 *
 * @param props Canvas component properties
 */
export const Canvas = ({ pic, fit, scale = 1, background }: Props): JSX.Element => {
  const container = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ viewer, setViewer ] = useState({ width: 0, height: 0 });
  const [ minZoom, setMinZoom ] = useState(1);


  // Zoom picture
  const zoom = useCallback((pic: Picture, scale: number) => {
    // Elements
    const cnt = container.current as HTMLDivElement;
    const cnv = canvas.current as HTMLCanvasElement;
    const img = pic.image;

    // Scale
    const zoom = scale < minZoom ? minZoom : scale > MAX_ZOOM ? MAX_ZOOM : scale;
    const w = Math.trunc(img.width * zoom);
    const h = Math.trunc(img.height * zoom);

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
      ctx.putImageData(pic.scale(zoom, zoom).image, 0, 0);
    }
  }, [ minZoom ]);


  const handleWheel = useCallback((e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (!pic) return;

    const current = (canvas.current as HTMLCanvasElement).width / pic.image.width;
    const scale = Math.max(minZoom, Math.min(MAX_ZOOM, e.deltaY < 0 ? current * ZOOM_STEP : current / ZOOM_STEP));

    if (current !== scale) zoom(pic, scale);
  }, [ zoom, pic, minZoom ]);


  // Handle container resize
  useEffect(() => {
    const handleResize = () => {
      setViewer({
        width: (container.current as HTMLDivElement).offsetWidth,
        height: (container.current as HTMLDivElement).offsetHeight
      });
    };

    handleResize();

    window.addEventListener(`resize`, handleResize, true);
    return () => window.removeEventListener(`resize`, handleResize, true);
  }, []);

  // Scale image
  useEffect(() => {
    // Canvas
    const cnv = canvas.current as HTMLCanvasElement;

    // Validate picture
    if (!pic || (viewer.width === 0) || (viewer.height === 0)) {
      cnv.width = 0;
      cnv.height = 0;
      cnv.style.left = ``;
      cnv.style.top = ``;
      return;
    }


    // Update minimum zoom
    const min = Math.min(1, viewer.width / pic.image.width, viewer.height / pic.image.height);
    setMinZoom(min);

    // update zoom
    zoom(pic, fit ? min : scale);
  }, [ zoom, viewer.width, viewer.height, fit, scale, pic ]);


  // Return canvas
  return (
    <div ref={container} onWheel={handleWheel} className="relative overflow-hidden w-full h-full" style={{ background }}>
      <canvas ref={canvas} className="absolute" />
    </div>
  );
};
