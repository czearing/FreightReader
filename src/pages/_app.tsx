import { HydrationBoundary, QueryClientProvider } from "@tanstack/react-query";
import type { DehydratedState } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Toaster } from "sonner";

import { queryClient } from "../clients/queryClient";

const SITE_NAME = "Freight Reader";
const DEFAULT_DESCRIPTION =
  "Freight Reader is an AI-powered tool that simplifies and summarizes complex freight documents, making it easier for logistics professionals to understand and manage their shipments.";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const dehydratedState = (pageProps as { dehydratedState?: DehydratedState })
    .dehydratedState;

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
        <HydrationBoundary state={dehydratedState}>
          <Component {...pageProps} />
        </HydrationBoundary>
        <Analytics />
        <SpeedInsights />
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{ duration: 4500 }}
        />
      </QueryClientProvider>
    </>
  );
}
