import { SocketProvider } from './utils/socket';
import Layout from './layout'; // Update the path based on your project structure
import type { AppProps } from 'next/app';

import './globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SocketProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SocketProvider>
  );
}

export default MyApp;
