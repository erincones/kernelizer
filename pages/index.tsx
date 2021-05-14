import { useRef, useState, useCallback } from "react";

import { SEO } from "../components/seo";

import { Sidebar } from "../components/sidebar";
import { Toolbar } from "../components/toolbar";
import { DragZone } from "../components/drag-zone";
import { Canvas, CanvasElement } from "../components/canvas";


/**
 * Home component
 *
 * @returns Home component
 */
const Home = (): JSX.Element => {
  const canvas = useRef<CanvasElement>(null);
  const [ image, setImg ] = useState<HTMLImageElement>();


  // Files handler
  const handleFiles = useCallback((files: FileList | null): void => {
    // Check if has files
    if (files && files.length) {
      const file = files[0];

      // Update source for valid image type
      if (file.type.startsWith(`image`)) {
        setImg(image => {
          if (image) {
            URL.revokeObjectURL(image.src);
          }

          const img = new Image();
          img.src = URL.createObjectURL(file);
          return img;
        });
      }
    }
  }, []);


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
          <Sidebar />

          {/* Image container */}
          <section className="flex flex-col flex-grow bg-trueGray-50 overflow-hidden">
            <Toolbar />

            <div className="flex-grow overflow-auto">
              <DragZone id="file" accept="image/*" onChange={handleFiles}>
                {image && <Canvas ref={canvas} img={image} />}
              </DragZone>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Home;
