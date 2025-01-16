// pages/_document.js (or src/pages/_document.js if using the src folder)
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Place your Google Fonts, Material Icons, or any other <link> / <meta> tags here. */}
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
          />

          {/* Example: Google Fonts */}
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          {/* The <Main /> component is where Next.js will render your pages */}
          <Main />
          {/* <NextScript> loads Next.js scripts like your bundles */}
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
