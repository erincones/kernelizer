import { useRef, useState, useCallback, ReactNode, SyntheticEvent, DragEvent, ChangeEvent, InputHTMLAttributes } from "react";


/**
 * Drag zone component properties
 */
interface Props {
  readonly id: InputHTMLAttributes<HTMLInputElement>["id"];
  readonly name?: InputHTMLAttributes<HTMLInputElement>["name"];
  readonly multiple?: InputHTMLAttributes<HTMLInputElement>["multiple"];
  readonly accept?: InputHTMLAttributes<HTMLInputElement>["accept"];
  readonly children?: ReactNode;
  readonly onChange?: (files: FileList | null) => unknown;
}


/**
 * Drag start handler
 *
 * @param e Drag event
 */
const handleDragStart = (e: DragEvent): void => {
  e.preventDefault();
  e.dataTransfer.effectAllowed = `copyMove`;
};

/**
 * Drag handler
 *
 * @param e Drag event
 */
const handleDrag = (e: DragEvent): void => {
  e.preventDefault();
  e.dataTransfer.dropEffect = `copy`;
};

/**
 * Stop propagation
 *
 * @param e Mouse event
 */
const stopPropagation = (e: SyntheticEvent): void => {
  e.stopPropagation();
};


/**
 * Drag zone component
 *
 * @param props Drag zone component properties
 * @returns Drag zone component
 */
export const DragZone = ({ id, name = id, multiple, accept, children, onChange }: Props): JSX.Element => {
  const input = useRef<HTMLInputElement>(null);
  const [ focused, setFocused ] = useState(false);


  // Drop handler
  const handleDrop = useCallback((e: DragEvent): void => {
    e.preventDefault();
    onChange?.(e.dataTransfer.files);
  }, [ onChange ]);

  // Input change handler
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
    onChange?.(e.currentTarget.files);
  }, [ onChange ]);

  // Click handler
  const handleClick = useCallback((): void => {
    (input.current as HTMLInputElement).click();
  }, []);

  // Handle focus
  const handleFocus = useCallback(() => {
    setFocused(true);
  }, []);

  // Handle focus
  const handleBlur = useCallback(() => {
    setFocused(false);
  }, []);


  // Return the drag zone component
  return (
    <div
      onDragStart={handleDragStart}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className="w-full h-full"
    >
      {/* Children or browse button */}
      {children || (
        <button
          onClick={handleClick}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="flex justify-center items-center shadow-inner w-full h-full"
        >
          <label
            htmlFor={id}
            onClick={stopPropagation}
            className={`${focused ? `ring ` : ``}text-blueGray-500 text-center tracking-wider leading-relaxed cursor-pointer px-4 py-2`}>
            <span className="text-3xl">Drag the image here</span>
            <br />
            or click to browse
          </label>
        </button>
      )}

      {/* Hidden file input */}
      <input
        ref={input}
        id={id}
        name={name}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
};
