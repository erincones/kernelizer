import { useRef, useState, useCallback, useEffect, CSSProperties } from "react";

import { Picture } from "../lib/picture";


/**
 * Canvas component properties
 */
interface Props {
  readonly pic?: Picture;
  readonly scale?: `fit` | `original` | number;
  readonly background?: CSSProperties["background"];
}

/** Maximum zoom */
const MAX_ZOOM = 20;


/**
 * Canvas component
 *
 * @param props Canvas component properties
 */
export const Canvas = ({ pic, scale = `fit`, background }: Props): JSX.Element => {
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
    const left = Math.max(Math.trunc(width - w) >> 1, 0);
    const top = Math.max(Math.trunc(height - h) >> 1, 0);

    cnv.style.left = `${Math.max(left, 0)}px`;
    cnv.style.top = `${Math.max(top, 0)}px`;


    // Repaint context
    if ((cnv.width !== w) || (cnv.height !== h)) {
      const ctx = cnv.getContext(`2d`) as CanvasRenderingContext2D;

      cnv.width = w;
      cnv.height = h;
      ctx.putImageData(pic.scale(zoom, zoom).image, 0, 0);
    }
  }, [ minZoom ]);



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
    zoom(pic, scale === `fit` ? min : scale === `original` ? 1 : scale);
  }, [ zoom, viewer.width, viewer.height, scale, pic ]);


  // Return canvas
  return (
    <div ref={container} className="relative overflow-hidden w-full h-full" style={{ background }}>
      <canvas ref={canvas} className="absolute" />
    </div>
  );
};
