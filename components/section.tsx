import { useState, useCallback, ReactNode } from "react";


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

  // Click handler
  const handleClick = useCallback(() => { setOpen(open => !open); }, []);


  // Return section component
  return (
    <li>
      {/* Header */}
      <header>
        <button onClick={handleClick} className="flex justify-between bg-blueGray-300 hover:bg-blueGray-200 cursor-pointer px-2 py-1 w-full">
          <h5 className="font-bold">{title}</h5>
          <span className="font-bold mr-2">{open ? `-` : `+`}</span>
        </button>
      </header>

      {/* Body */}
      {open && <ul className="text-sm pl-4 pr-2 py-1">{children}</ul>}
    </li>
  );
};
