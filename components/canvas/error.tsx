import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


/**
 * Error component properties
 */
interface Props {
  readonly children: ReadonlyArray<string>;
  readonly onClose?: () => unknown;
}


/**
 * Error component
 *
 * @param props Error component properties
 */
export const Error = ({ children, onClose }: Props): JSX.Element | null => {
  if (children.length === 0) {
    return null;
  }

  // Return errors
  return (
    <div className="absolute bg-red-200 text-red-700 shadow overflow-auto p-2 max-w-full max-h-full">
      <div className="flex mb-1">
        <strong className="flex-grow">
          Critical GLSL errors:
        </strong>
        <button type="button" onClick={onClose} className="hover:text-red-900 focus:outline-none focus:ring">
          <FontAwesomeIcon icon="times" fixedWidth />
        </button>
      </div>

      <ol className="list-inside list-decimal font-mono text-sm break-word whitespace-pre-wrap">
        {children.map((error, i) => (
          <li key={i}>
            {error}
          </li>
        ))}
      </ol>
    </div>
  );
};
