import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { AppProps } from "next/app";
import Head from "next/head";
import { QueryClientProvider, hydrate } from "@tanstack/react-query";
import { queryClient } from "../clients/queryClient";
import type { DehydratedState } from "@tanstack/react-query";

const SITE_NAME = "Freight Reader";
const DEFAULT_DESCRIPTION =
  "Freight Reader is an AI-powered tool that simplifies and summarizes complex freight documents, making it easier for logistics professionals to understand and manage their shipments.";

const hydratePageProps = (pageProps: AppProps["pageProps"]) => {
  const dehydrated = (pageProps as { dehydratedState?: DehydratedState })
    .dehydratedState;
  if (dehydrated) {
    hydrate(queryClient, dehydrated);
  }
};

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>{SITE_NAME}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="title" content={SITE_NAME} />
        <meta name="description" content={DEFAULT_DESCRIPTION} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:type" content="website" />
        <link
          rel="icon"
          type="image/svg+xml"
          href="/image/Book-Cook-Logo.svg"
        />
      </Head>
      <QueryClientProvider client={queryClient}>
        <AppContainer>
          <Component {...pageProps} />
          <Analytics />
          <SpeedInsights />
        </AppContainer>
      </QueryClientProvider>
    </>
  );
}
