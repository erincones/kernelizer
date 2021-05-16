import { useState, useCallback, useReducer, useEffect } from "react";

import { SEO } from "../components/seo";

import { initialKernelizer, kernelizer } from "../reducers/kernelizer";
import { Picture } from "../lib/picture";

import { SecureContext } from "../components/secure-context";
import { Sidebar } from "../components/sidebar";
import { Toolbar } from "../components/toolbar";
import { Error } from "../components/error";
import { DragZone } from "../components/drag-zone";
import { Canvas } from "../components/canvas";


/**
 * Home component
 *
 * @returns Home component
 */
const Home = (): JSX.Element => {
  const [ src, setSrc ] = useState(``);
  const [ loading, setLoading ] = useState(false);
  const [ { history, current, scale, fit, error }, dispatch ] = useReducer(kernelizer, initialKernelizer);


  // Files handler
  const handleFiles = useCallback((files: FileList | null): void => {
    if (files && files.length) {
      const file = files[0];

      if (file.type.startsWith(`image`)) {
        setLoading(true);
        setSrc(src => {
          URL.revokeObjectURL(src);
          return URL.createObjectURL(file);
        });
      }
      else {
        dispatch({ type: `ERROR`, error: `Not valid format: ${file.type}` });
      }
    }
  }, []);

  // Close error handler
  const closeError = useCallback(() => {
    dispatch({ type: `ERROR` });
  }, []);

  // Scale change handler
  const handleScaleChange = useCallback((scale: number, min?: number) => {
    dispatch({ type: `SET_SCALE`, scale, min });
  }, []);


  // Load new image
  useEffect(() => {
    if (!src) return;

    // Image parser
    const img = new Image();

    // Loaded image
    img.onload = () => {
      dispatch({ type: `LOAD`, pic: Picture.fromImage(img) });
      setLoading(false);
    };

    // Handle error
    img.onerror = err => {
      dispatch({ type: `CLOSE` });
      dispatch({
        type: `ERROR`,
        error: typeof err === `string` ? err : `Unknown error`
      });
      setLoading(false);
    };

    // Notify reset
    img.onabort = () => {
      dispatch({ type: `CLOSE` });
      dispatch({ type: `ERROR`, error: `Loading aborted` });
      setLoading(false);
    };

    // Load image
    img.src = src;
  }, [ src ]);


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
