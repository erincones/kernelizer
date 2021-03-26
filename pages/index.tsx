import { SEO } from "../components/seo";


/**
 * Home component
 *
 * @returns Home component
 */
const Home = (): JSX.Element => {
  // Return the home component
  return (
    <>
      <SEO title="Kernelizer" />

      <div className="flex flex-col min-h-screen md:max-h-screen">
        {/* Header */}
        <header className="bg-blueGray-600 text-center px-2 py-1">
          <h3 className="text-blueGray-100 text-xl font-bold">
            Kernelizer
          </h3>
        </header>

        {/* Configuration bar */}
        <div className="flex flex-col md:flex-row flex-grow overflow-hidden w-full h-full">
          <section className="text-blueGray-800 bg-blueGray-100 border-b-8 md:border-b-0 md:border-r-8 border-blueGray-600 cursor-default overflow-auto md:w-80 h-1/3 md:h-auto">
            Settings
          </section>

          {/* Image container */}
          <section className="flex flex-col flex-grow bg-trueGray-50 overflow-auto">
            <div className="bg-blueGray-300 px-2 py-1">
              Options
            </div>
            <div className="flex-grow">
              Canvas
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Home;
