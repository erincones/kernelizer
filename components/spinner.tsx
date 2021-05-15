import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


/**
 * Spinner component
 */
export const Spinner = (): JSX.Element => {
  return (
    <div title="Loading" className="flex flex-grow justify-center items-center w-full h-full">
      <FontAwesomeIcon
        icon="spinner"
        pulse
        className="text-blueGray-500 text-3xl"
      />
    </div>
  );
};
