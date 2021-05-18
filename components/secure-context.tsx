import { ReactNode, useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Spinner } from "./spinner";


/** Secure context component properties */
interface Props {
  readonly children?: ReactNode;
}


/**
 * Secure context component
 *
 * @param props Secure context component properties
 */
export const SecureContext = ({ children }: Props): JSX.Element => {
  const [ supported, setSupported ] = useState<boolean>();


  // Validate support
  useEffect(() => {
    setSupported(document.createElement(`canvas`).getContext(`webgl2`) !== null);
  }, []);


  // Return component
  return supported ? (
    <main className="flex flex-col md:flex-row flex-grow overflow-hidden w-full h-full">
      {children}
    </main>
  ) : supported === false ? (
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
          Your system does not support <a
            title="Support details"
            href="https://caniuse.com/mdn-api_canvasrenderingcontext2d"
            target="noopener noreferrer"
            className="font-mono font-middle underline focus:outline-none focus:ring"
          >
            WebGL2RenderingContext
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
  ) : (
    <Spinner />
  );
};
