import Head from "next/head";


/**
 * SEO properties
 */
interface Props {
  readonly title: string,
  readonly twitterCard?: boolean,
  readonly openGraph?: boolean
}


/**
 * SEO component
 *
 * @param props SEO component properties
 * @returns SEO component
 */
export const SEO = ({ title, twitterCard = true, openGraph = true }: Props): JSX.Element => {
  return (
    <Head>
      {/* Twitter card */}
      {twitterCard && (
        <>
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Kernelizer" />
          <meta name="twitter:description" content="Another simple web image viewer and editor" />
          <meta name="twitter:creator" content="@ErickRincones" />
          <meta name="twitter:image" content="https://kernelizer.vercel.app/cover.png" />
        </>
      )}

      {/* Open graph */}
      {openGraph && (
        <>
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Kernelizer" />
          <meta property="og:description" content="Another simple web image viewer and editor" />
          <meta property="og:url" content="https://kernelizer.vercel.app" />
          <meta property="og:image" content="https://kernelizer.vercel.app/cover.png" />
          <meta property="og:image:width" content="1920" />
          <meta property="og:image:height" content="1080" />
        </>
      )}

      {/* Title and manifest */}
      <title>{title}</title>
      <link rel="manifest" href="/manifest.json" />
    </Head>
  );
};
