import { useState, useReducer, useCallback } from "react";

import { SEO } from "../components/seo";

import { initialKernelizer, kernelizer } from "../reducers/kernelizer";
import { Picture } from "../lib/picture";

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
  const [ { history, current, scale, fit, error }, dispatch ] = useReducer(kernelizer, initialKernelizer);


  // Image loader
  const loadImage = useImageLoader({
    ontypeerror: file => {
      dispatch({ type: `ERROR`, error: `Not valid format: ${file.type}` });
    },
    onload: function() {
      dispatch({ type: `LOAD`, pic: Picture.fromImage(this) });
      setLoading(false);
    },
    onerror: (err: ErrorEvent) => {
      dispatch({ type: `CLOSE`, error: typeof err === `string` ? err : `Unknown error` });
      setLoading(false);
    },
    onabort: () => {
      dispatch({ type: `CLOSE`, error: `Loading aborted` });
      setLoading(false);
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
    dispatch({ type: `ERROR` });
  }, []);

  // Scale change handler
  const handleScaleChange = useCallback((scale: number, min?: number) => {
    dispatch({ type: `SET_SCALE`, scale, min });
  }, []);


  // Current image
  const picture = history[current];

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

        <SecureContext>
          <Sidebar />

          <section className="flex flex-col flex-grow bg-trueGray-50 overflow-hidden">
            <Toolbar />

            <Error onClose={closeError}>
              {error}
            </Error>

            <div className="flex-grow overflow-hidden">
              <DragZone id="file" accept="image/*" loading={loading} onChange={handleFiles}>
                {picture && (
                  <Canvas
                    pic={picture}
                    scale={scale}
                    fit={fit}
                    onScaleChange={handleScaleChange}
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
