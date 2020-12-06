import { SEO } from "../components/seo";


/**
 * Error 404 page
 */
const Error404 = (): JSX.Element => {
  return (
    <>
      <SEO title="Kernelizer - Not found" />

      <pre className="whitespace-pre overflow-x-auto ">
        404: Not found
      </pre>
    </>
  );
};

export default Error404;
