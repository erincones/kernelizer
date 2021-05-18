import { Picture } from "../lib/picture";


/**
 * Initial kernelizer status
 */
interface InitialState {
  readonly name?: undefined;
  readonly picture?: undefined;
  readonly history: [];
  readonly current: 0;
  readonly error?: string;
}

/**
 * Common kernelizer status
 */
interface CommonState {
  readonly name: string;
  readonly picture: Picture;
  readonly history: ReadonlyArray<Picture>;
  readonly current: number;
  readonly error?: string;
}

/**
 * Kernelizer status
 */
type State = InitialState | CommonState;


/** Picture action */
interface PictureAction {
  readonly type: `OPEN` | `UPDATE`;
  readonly pic: Picture;
  readonly name?: string;
}

/** CloseAction */
interface CloseAction {
  readonly type: `CLOSE`;
  readonly error?: string;
}

/** Error action */
interface ErrorAction {
  readonly type: `ERROR`;
  readonly error?: string;
}

/** Simple action */
interface SimpleAction {
  readonly type: `FORWARD` | `BACKWARD`;
}


/** Action */
type Action = PictureAction | CloseAction | ErrorAction | SimpleAction;


/** Default name */
const DEFAULT_NAME = `img.png`;

/**
 * Initial kernelizer status
 */
export const initialKernelizer: InitialState = {
  history: [],
  current: 0
};


/**
 * Insert a new picture in the history.
 *
 * @param state Current state
 * @param pic Picture to push
 * @param name Picture image
 * @returns New state
 */
const save = (state: State, pic: Picture, name = DEFAULT_NAME): CommonState => {
  const next = state.current + 1;

  return {
    name: state.name || name,
    picture: pic,
    history: state.history.slice(0, next).concat(pic),
    current: next
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
    case `OPEN`:   return { name: action.name || DEFAULT_NAME, picture: action.pic, history: [ action.pic ], current: 0 };
    case `UPDATE`: return save(state, action.pic, action.name);

    case `CLOSE`: return { ...initialKernelizer, error: action.error };
    case `ERROR`: return action.error === state.error ? state : { ...state, error: action.error };

    case `FORWARD`:  return !state.picture || (state.current === state.history.length - 1) ? state : { ...state, current: state.current + 1 };
    case `BACKWARD`: return !state.picture || !state.current ? state : { ...state, current: state.current - 1 };
  }
};
