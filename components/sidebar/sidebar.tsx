import { Section } from "./section";


/**
 * Sidebar component
 */
export const Sidebar = (): JSX.Element => {
  return (
    <ul className="flex-shrink-0 bg-blueGray-100 text-blueGray-800 border-b-8 md:border-b-0 md:border-r-8 border-blueGray-600 cursor-default overflow-auto md:w-80 h-1/3 md:h-auto">
      <Section title="File" defaultOpen>
        <li className="flex">
          Name:
        </li>
        <li className="flex">
          Size:
        </li>
        <li className="flex">
          Format:
        </li>
      </Section>

      <Section title="Image">
        <li className="flex">
          Dimension:
        </li>
        <li className="flex">
          Bit depth:
        </li>
        <li className="flex">
          Colors:
        </li>
      </Section>
    </ul>
  );
};
