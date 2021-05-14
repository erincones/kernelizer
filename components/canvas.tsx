import { forwardRef, useRef, useImperativeHandle, useEffect, CSSProperties } from "react";


/**
 * Canvas component properties
 */
interface Props {
  readonly img?: HTMLImageElement;
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
export const Canvas = forwardRef<CanvasElement, Props>(({ img, background }: Props, ref): JSX.Element => {
  const container = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);


  // Setup canvas ref
  useImperativeHandle(ref, () => ({
    element: canvas.current
  }), []);

  // Update image
  useEffect(() => {
    const cnv = canvas.current;
    if (!cnv) return;

    const ctx = cnv.getContext(`2d`);
    if (!ctx) return;

    if (img) {
      img.addEventListener(`load`, function() {
        cnv.width = this.width;
        cnv.height = this.height;
        ctx.drawImage(this, 0, 0);
      });
    }
    else {
      ctx.clearRect(0, 0, cnv.width, cnv.height);
    }
  }, [ img ]);


  // Return canvas
  return (
    <div ref={container} className="w-full h-full" style={{ background }}>
      <canvas ref={canvas} />
    </div>
  );
});

Canvas.displayName = `Canvas`;
