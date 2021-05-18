import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


/**
 * Error component properties
 */
interface Props {
  readonly children?: string;
  readonly onClose?: () => unknown;
}


/**
 * Error component
 *
 * @param props Error component properties
 */
export const Error = ({ children, onClose }: Props): JSX.Element | null => {
  // Validate children
  if (!children) {
    return null;
  }

  // Return error
  return (
    <div className="flex bg-red-200 text-red-700 text-sm border-b border-red-500 px-2 py-1">
      <div className="flex-grow">
        <FontAwesomeIcon icon="exclamation-triangle" fixedWidth className="mr-1" />
        {children}
      </div>
      <button type="button" onClick={onClose} className="hover:text-red-900 focus:outline-none focus:ring">
        <FontAwesomeIcon icon="times" fixedWidth />
      </button>
    </div>
  );
};
