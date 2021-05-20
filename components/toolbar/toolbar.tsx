import { Separator } from "./separator";
import { Button } from "./button";

interface Props {
  readonly onClose: () => void;
}


/**
 * Toolbar component
 */
export const Toolbar = ({ onClose }: Props): JSX.Element => {
  return (
    <div className="flex bg-blueGray-300 text-blueGray-800 border-b border-blueGray-400 px-2 py-1">
      <div className="space-x-1">
        <Button icon="file-upload" onClick={undefined} />
        <Button icon="file-download" onClick={undefined} />
      </div>

      <Separator />

      <div className="space-x-1">
        <Button icon="search-plus" onClick={undefined} />
        <Button icon="search-minus" onClick={undefined} />
        <Button icon="compress" onClick={undefined} />
        <Button icon="expand" onClick={undefined} />
      </div>

      <Separator />

      <div className="space-x-1">
        <Button icon="undo" onClick={undefined} />
        <Button icon="redo" onClick={undefined} />
      </div>

      <Separator />

      <div className="space-x-1">
        <Button icon="reply" onClick={undefined} />
        <Button icon="share" onClick={undefined} />
      </div>

      <div className="ml-auto">
        <Button icon="times" onClick={onClose} />
      </div>
    </div>
  );
};
