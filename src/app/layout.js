import localFont from "next/font/local";
import "./globals.css";
import Providers from "./providers";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Suspense } from "react";
import Loading from "./loading";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Money Manager",
  description: "Your personal Wallet",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <Suspense fallback={<Loading />}>
        <Providers>
        {children}
        </Providers>
        </Suspense>
      </body>
    </html>
  );
}
