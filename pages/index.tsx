import { useRef, useState, useCallback, useEffect } from "react";

import { SEO } from "../components/seo";

import { Sidebar } from "../components/sidebar";
import { DragZone } from "../components/drag-zone";


/**
 * Home component
 *
 * @returns Home component
 */
const Home = (): JSX.Element => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ src, setSrc ] = useState<string>();
  const [ , setImgs ] = useState<HTMLImageElement>();

  // Files handler
  const handleFiles = useCallback((files: FileList | null): void => {
    // Check if has files
    if (files && files.length) {
      const file = files[0];

      // Update source for valid image type
      if (file.type.startsWith(`image`)) {
        setSrc(src => {
          if (src) {
            URL.revokeObjectURL(src);
          }

          return URL.createObjectURL(file);
        });
      }
    }
  }, []);

  // Clear handler
  const handleClear = useCallback(() => {
    setSrc(src => {
      if (src) {
        URL.revokeObjectURL(src);
      }

      return undefined;
    });
  }, []);


  // Load and release image
  useEffect(() => {
    if (src === undefined) {
      setImgs(undefined);
    }
    else {
      const img = new Image();
      img.src = src;

      img.addEventListener(`load`, function() {
        if (canvas.current) {
          canvas.current.width = this.width;
          canvas.current.height = this.height;

          const ctx = canvas.current.getContext(`2d`);
          ctx?.drawImage(this, 0, 0);
        }
      });

      setImgs(img);
    }
  }, [ src ]);


  // Return the home component
  return (
    <>
      <SEO title="Kernelizer" />

      <div className="flex flex-col min-h-screen md:max-h-screen">
        {/* Header */}
        <header className="bg-blueGray-600 text-center px-2 py-1">
          <h3 className="text-blueGray-100 text-xl font-bold">
            Kernelizer
          </h3>
        </header>

        <div className="flex flex-col md:flex-row flex-grow overflow-hidden w-full h-full">
          {/* Settings bar */}
          <Sidebar />

          {/* Image container */}
          <section className="flex flex-col flex-grow bg-trueGray-50 overflow-hidden">
            {/* Image controls */}
            <div className="bg-blueGray-300 px-2 py-1">
              <div>
                <button onClick={handleClear}>
                  Clear
                </button>
              </div>
            </div>

            {/* Drag zone and canvas */}
            <div className="flex-grow overflow-auto">
              {src === undefined ?
                <DragZone accept="image/*" onChange={handleFiles} /> :
                <canvas ref={canvas} />
              }
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Home;
