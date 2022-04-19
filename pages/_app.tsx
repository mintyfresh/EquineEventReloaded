import 'bootstrap/dist/css/bootstrap.min.css';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';
import Layout from '../components/Layout';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => (
    <Layout>{page}</Layout>
  ));

  return (
    getLayout(<Component {...pageProps} />)
  );
}

export default MyApp;
