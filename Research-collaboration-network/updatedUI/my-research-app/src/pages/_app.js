// src/pages/_app.js
import '../styles/globals.css'; // Ensure Tailwind CSS is set up correctly
import Head from 'next/head';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>ResearchHub</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="A hub for researchers to collaborate and share." />
        <meta property="og:title" content="ResearchHub" />
        <meta property="og:description" content="A hub for researchers to collaborate and share." />
        <meta property="og:image" content="/path-to-image.png" />
        <meta property="og:url" content="https://your-app-url.com" />
      </Head>

      <Component {...pageProps} />
    </>
  );
}
