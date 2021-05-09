import { useState, useCallback, ReactNode } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


/**
 * Section component properties
 */
interface SectionProps {
  readonly title: string;
  readonly defaultOpen?: boolean;
  readonly children: ReactNode;
}


/**
 * Section component
 *
 * @param props Section component properties
 * @returns Section component
 */
export const Section = ({ title, defaultOpen = false, children }: SectionProps): JSX.Element => {
  const [ open, setOpen ] = useState(defaultOpen);
  const [ focused, setFocused ] = useState(false);

  // Click handler
  const handleClick = useCallback(() => { setOpen(open => !open); }, []);

  // Handle focus
  const handleFocus = useCallback(() => { setFocused(true); }, []);

  // Handle focus
  const handleBlur = useCallback(() => { setFocused(false); }, []);


  // Return section component
  return (
    <li>
      {/* Header */}
      <header className="bg-blueGray-300 border-b border-blueGray-400 hover:bg-blueGray-200">
        <button
          onClick={handleClick}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="flex justify-between focus:outline-none px-2 py-1 w-full"
        >
          <h5 className="font-bold">{title}</h5>
          <span className={focused ? `ring` : undefined}>
            <FontAwesomeIcon icon={open ? `angle-up` : `angle-down`} fixedWidth />
          </span>
        </button>
      </header>

      {/* Body */}
      {open && <ul className="bg-blueGray-50 text-sm shadow-inner pl-4 pr-2 py-1">{children}</ul>}
    </li>
  );
};
