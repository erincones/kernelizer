import { useRef, useMemo, useCallback, DragEvent, ChangeEvent, InputHTMLAttributes } from "react";


/**
 * Drag zone component properties
 */
interface Props {
  readonly multiple?: InputHTMLAttributes<HTMLInputElement>["multiple"];
  readonly accept?: InputHTMLAttributes<HTMLInputElement>["accept"];
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
 * Drag zone component
 *
 * @param props Drag zone component properties
 * @returns Drag zone component
 */
export const DragZone = ({ multiple, accept, onChange }: Props): JSX.Element => {
  const input = useRef<HTMLInputElement>(null);

  // Handlers
  const [ handleDrop, handleInputChange ] = useMemo(() => {
    return onChange ? [
      // Drop handler
      (e: DragEvent): void => {
        e.preventDefault();
        onChange(e.dataTransfer.files);
      },

      // Input change handler
      (e: ChangeEvent<HTMLInputElement>): void => {
        onChange(e.currentTarget.files);
      }
    ] : [];
  }, [ onChange ]);

  // Click handler
  const handleClick = useCallback((): void => {
    (input.current as HTMLInputElement).click();
  }, []);


  // Return the drag zone component
  return (
    <label
      onClick={handleClick}
      onDragStart={handleDragStart}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className="flex justify-center items-center cursor-pointer w-full h-full"
    >
      <input
        ref={input}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      <div className="text-blueGray-500 text-center tracking-wider leading-relaxed">
        <span className="text-3xl">Drag the image here</span>
        <br />
        or click to browse
      </div>
    </label>
  );
};
