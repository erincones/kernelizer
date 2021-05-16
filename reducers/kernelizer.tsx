import { Picture } from "../lib/picture";


/**
 * Kernelizer status
 */
interface State {
  readonly temporary?: Picture;
  readonly history: ReadonlyArray<Picture>;
  readonly current: number;
  readonly scaleFactor: 1.25;
  readonly scaleMin: number;
  readonly scaleMax: 20;
  readonly scale: number;
  readonly fit?: boolean;
  readonly error?: string;
}


/** Picture action */
interface PictureAction {
  readonly type: `LOAD` | `ENQUEUE`;
  readonly pic: Picture;
}

/** Temporary action */
interface TemporaryAction {
  readonly type: `SET_TEMPORARY`;
  readonly pic?: Picture;
}

/** Error action */
interface ErrorAction {
  readonly type: `ERROR`;
  readonly error?: string;
}

/** Scale action */
interface ScaleAction {
  readonly type: `SET_SCALE`;
  readonly scale: number;
  readonly min?: number;
}

/** Simple action */
interface SimpleAction {
  readonly type: `FORWARD` | `BACKWARD` | `CLOSE` | `FIT`;
}


/** Action */
type Action = PictureAction | TemporaryAction | ErrorAction | ScaleAction | SimpleAction;


/**
 * Initial kernelizer status
 */
export const initialKernelizer: State = {
  history: [],
  current: 0,
  scaleFactor: 1.25,
  scaleMin: 1,
  scaleMax: 20,
  scale: 1,
  fit: true
};


/**
 * Load the given picture
 *
 * @param state Current state
 * @param pic Picture to load
 * @returns New status
 */
const load = (pic: Picture): State => {
  return {
    ...initialKernelizer,
    history: [ pic ],
    fit: true
  };
};

/**
 * Enqueue the given picture after the current.
 *
 * @param state Current state
 * @param pic Picture to push
 * @param fit Fit flag
 * @returns New status
 */
const enqueue = (state: State, pic: Picture): State => {
  const next = state.current + 1;

  return {
    ...state,
    history: state.history.slice(0, next).concat(pic),
    current: next
  };
};

/**
 * Set the new given scale values
 *
 * @param state Current state
 * @param factor New scale value
 * @param fit Fit flag
 * @returns New status
 */
const scale = (state: State, factor: number, min?: number): State => {
  const scaleMin = min !== undefined ? min : state.scaleMin;
  const scale = Math.max(scaleMin, Math.min(state.scaleMax, factor));

  return (state.scale === scale) && (state.scaleMin === scaleMin) ? state :
    {
      ...state,
      scaleMin,
      scale,
      fit: state.fit && (scale === scaleMin)
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
    case `LOAD`:          return load(action.pic);
    case `ENQUEUE`:       return enqueue(state, action.pic);
    case `SET_TEMPORARY`: return state.temporary === action.pic ? state : { ...state, temporary: action.pic };

    case `CLOSE`: return initialKernelizer;
    case `ERROR`: return action.error === state.error ? state : { ...state, error: action.error };

    case `FORWARD`:  return state.current === state.history.length - 1 ? state : { ...state, current: state.current + 1 };
    case `BACKWARD`: return state.current === 0 ? state : { ...state, current: state.current - 1 };

    case `FIT`:      return state.fit ? state : { ...state, fit: true };
    case `SET_SCALE`: return scale(state, action.scale, action.min);
  }
};
