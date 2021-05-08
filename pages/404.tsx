import { SEO } from "../components/seo";

import { cowsay } from "cowsayjs";


/**
 * Error 404 page
 *
 * @returns Error 404 page
 */
const Error404 = (): JSX.Element => {
  return (
    <>
      <SEO title="Kernelizer - Not found" />

      <pre className="leading-tight">
        {cowsay(`404: Not found`)}
      </pre>
    </>
  );
};

export default Error404;
