import { ButtonHTMLAttributes } from "react";

import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


/**
 * Button component properties
 */
interface Props {
  readonly icon: IconProp;
  readonly onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
}


/**
 * Button component
 *
 * @param props Button component properties
 */
export const Button = ({ icon, onClick }: Props): JSX.Element => {
  return (
    <button onClick={onClick} className="focus:outline-none focus:ring">
      <FontAwesomeIcon icon={icon} fixedWidth />
    </button>
  );
};
