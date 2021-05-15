import Document, { Html, Head, Main, NextScript } from "next/document";


/**
 * Custom Document class
 */
class CustomDocument extends Document {
  /**
   * Render component
   *
   * @returns Render component
   */
  public render(): JSX.Element {
    return (
      <Html lang="en">
        <Head />

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
