import { Picture } from "../lib/picture";


/**
 * Kernelizer status
 */
interface State {
  readonly history: ReadonlyArray<Picture>;
  readonly current: number;
  readonly error?: string;
}

/** Load action */
interface LoadAction {
  readonly type: `LOAD`;
  readonly payload: HTMLImageElement | ImageData;
}

/** Close action */
interface CloseAction {
  readonly type: `CLOSE`;
}

/** Error action */
interface ErrorAction {
  readonly type: `ERROR`;
  readonly payload?: string;
}

/** Action */
type Action = LoadAction | CloseAction | ErrorAction;


/**
 * Initial kernelizer status
 */
export const initialKernelizer: State = {
  history: [],
  current: 0
};


/**
 * Load the given image
 *
 * @param state Current status
 * @param img Image to load
 * @returns New status
 */
const load = (img: HTMLImageElement | ImageData): State => {
  return {
    history: [ img instanceof ImageData ? Picture.fromImageData(img) : Picture.fromImage(img) ],
    current: 0
  };
};


/**
 * Kernelizer reducer
 *
 * @param state Current state
 * @param action Action
 * @returns Next state
 */
export const kernelizer = (state: State, action: Action): State => {
  switch (action.type) {
    case `LOAD`: return load(action.payload);
    case `CLOSE`: return initialKernelizer;
    case `ERROR`: return action.payload === state.error ? state : { ...state, error: action.payload };
  }
};
