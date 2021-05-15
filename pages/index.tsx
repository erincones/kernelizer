import { useRef, useState, useCallback, useReducer, useEffect } from "react";

import { SEO } from "../components/seo";

import { initialKernelizer, kernelizer } from "../reducers/kernelizer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Sidebar } from "../components/sidebar";
import { Toolbar } from "../components/toolbar";
import { Error } from "../components/error";
import { DragZone } from "../components/drag-zone";
import { Canvas, CanvasElement } from "../components/canvas";
import { Spinner } from "../components/spinner";


/**
 * Home component
 *
 * @returns Home component
 */
const Home = (): JSX.Element => {
  const canvas = useRef<CanvasElement>(null);
  const [ src, setSrc ] = useState(``);
  const [ supported, setSupported ] = useState<boolean>();
  const [ loading, setLoading ] = useState(false);
  const [ { history, current, error }, dispatch ] = useReducer(kernelizer, initialKernelizer);


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
        dispatch({ type: `ERROR`, payload: `Not valid format: ${file.type}` });
      }
    }
  }, []);

  // Close error handler
  const closeError = useCallback(() => {
    dispatch({ type: `ERROR` });
  }, []);


  // Load new image
  useEffect(() => {
    if (!src) return;

    // Image parser
    const img = new Image();

    // Loaded image
    img.onload = () => {
      dispatch({ type: `LOAD`, payload: img });
      setLoading(false);
    };

    // Handle error
    img.onerror = err => {
      dispatch({ type: `CLOSE` });
      dispatch({
        type: `ERROR`,
        payload: typeof err === `string` ? err : `Unknown error`
      });
      setLoading(false);
    };

    // Notify reset
    img.onabort = () => {
      dispatch({ type: `CLOSE` });
      dispatch({ type: `ERROR`, payload: `Loading aborted` });
      setLoading(false);
    };

    // Load image
    img.src = src;
  }, [ src ]);

  // Validate support
  useEffect(() => {
    setSupported(document.createElement(`canvas`).getContext(`2d`) !== null);
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

        {supported === undefined ? ( // Loading
          <Spinner />
        ) : supported === false ? ( // Not supported error
          <main className="flex flex-col flex-grow justify-center items-center w-full h-full">
            <div className="flex flex-grow justify-center items-center">
              <span>
                <FontAwesomeIcon
                  icon="times-circle"
                  fixedWidth
                  className="text-5xl text-red-700 mr-2"
                />
              </span>
              <p className="text-blueGray-800">
                This browser does not support <a
                  title="Support details"
                  href="https://caniuse.com/mdn-api_canvasrenderingcontext2d"
                  target="noopener noreferrer"
                  className="font-mono font-middle underline focus:outline-none focus:ring"
                >
                  CanvasRenderingContext2D
                </a>.
              </p>
            </div>
            <footer className="text-sm text-center px-2 py-1">
              If you think this a mistake, <a
                href="https://github.com/erincones/kernelizer/issues/new"
                target="noopener noreferrer"
                className="underline focus:outline-none focus:ring"
              >
                create a new issue
              </a>.
            </footer>
          </main>
        ) : ( // Kernelizer
          <main className="flex flex-col md:flex-row flex-grow overflow-hidden w-full h-full">
            <Sidebar />

            <section className="flex flex-col flex-grow bg-trueGray-50 overflow-hidden">
              <Toolbar />

              <Error onClose={closeError}>
                {error}
              </Error>

              <div className="flex-grow overflow-auto">
                <DragZone id="file" accept="image/*" loading={loading} onChange={handleFiles}>
                  {picture && <Canvas ref={canvas} pic={picture} />}
                </DragZone>
              </div>
            </section>
          </main>
        )}
      </div>
    </>
  );
};

export default Home;
