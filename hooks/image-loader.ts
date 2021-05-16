import { useRef, useState, useEffect, Dispatch, SetStateAction } from "react";


/** Image listener type */
type listener<K extends keyof HTMLElementEventMap> = (this: HTMLImageElement, ev: HTMLElementEventMap[K]) => unknown;

/**
 * Image loader hook properties
 */
interface Props {
  readonly ontypeerror: (file: File) => unknown;
  readonly onload: listener<`load`>;
  readonly onerror?: listener<`error`>;
  readonly onabort?: listener<`abort`>;
}


/**
 * Image loader hook
 *
 * @param props Image loader hook properties
 */
export const useImageLoader = (props: Props): Dispatch<SetStateAction<File | undefined>> => {
  const listener = useRef(props);
  const [ file, setFile ] = useState<File>();


  // Load image file
  useEffect(() => {
    if (!file) return;

    // Load image file
    if (file.type.startsWith(`image`)) {
      const { onload, onerror, onabort } = listener.current;
      const img = new Image();

      // Add listeners
      img.addEventListener(`load`, onload, true);
      if (onerror) img.addEventListener(`error`, onerror, true);
      if (onabort) img.addEventListener(`abort`, onabort, true);

      // Load image
      img.src = URL.createObjectURL(file);
      URL.revokeObjectURL(img.src);
    }

    // Type errror
    else {
      listener.current.ontypeerror(file);
    }

    // Reset file
    setFile(undefined);
  }, [ file ]);


  return setFile;
};