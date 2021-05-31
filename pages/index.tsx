import { useState, useCallback } from "react";

import { SEO } from "../components/seo";

import colors from "tailwindcss/colors";

import { SecureContext } from "../components/secure-context";
import { Sidebar } from "../components/sidebar";
import { Toolbar } from "../components/toolbar";
import { Error } from "../components/error";
import { DragZone } from "../components/drag-zone";
import { Canvas } from "../components/canvas";
import { useImageLoader } from "../hooks/image-loader";


/**
 * Home component
 *
 * @returns Home component
 */
const Home = (): JSX.Element => {
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState<string>();
  const [ img, setImg ] = useState<HTMLImageElement>();

  // Image loader
  const loadImage = useImageLoader({
    ontypeerror: file => {
      setError(`Not valid format: ${file.type}`);
    },
    onload: function() {
      setImg(this);
      setLoading(false);
    },
    onerror: (err: ErrorEvent) => {
      setLoading(false);
      setError(typeof err === `string` ? err : `Unknown error`);
    },
    onabort: () => {
      setLoading(false);
      setError(`Loading aborted`);
    }
  });


  // Files handler
  const handleFiles = useCallback((files: FileList | null): void => {
    if (files && files.length) {
      loadImage(files[0]);
    }
  }, [ loadImage ]);

  // Close error handler
  const closeError = useCallback(() => {
    setError(undefined);
  }, []);


  // Return the home component
  return (
    <>
      <SEO title="Kernelizer" />

      <div className="flex flex-col cursor-default min-h-screen md:max-h-screen">
        {/* Header */}
        <header className="bg-blueGray-600 text-center px-2 py-1">
          <h3 className="text-blueGray-100 text-xl font-bold">
            Kernelizer
          </h3>
        </header>

        <SecureContext>
          <Sidebar />

          <section className="flex flex-col flex-grow bg-trueGray-50 overflow-hidden">
            <Toolbar onClose={() => { setImg(undefined); }} />

            <Error onClose={closeError}>
              {error}
            </Error>

            <div className="flex-grow overflow-hidden">
              <DragZone id="file" accept="image/*" loading={loading} onChange={handleFiles}>
                {img && (
                  <Canvas
                    img={img}
                    background={colors.blueGray[`50`]}
                    grid0="#FFFFFF"
                    grid1="#DBDBDB"
                  />
                )}
              </DragZone>
            </div>
          </section>
        </SecureContext>
      </div>
    </>
  );
};

export default Home;
