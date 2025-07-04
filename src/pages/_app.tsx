import { Navigation } from "@/components/Navigation";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <div>
      <Navigation/>
      <Component {...pageProps} />
  </div>;
}
