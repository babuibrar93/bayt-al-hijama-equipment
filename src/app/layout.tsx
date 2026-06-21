import type { Metadata } from "next";
import { siteMetadata } from "@/lib/metadata";
import { fontVariables, inter } from "@/lib/fonts";
import StructuredData from "@/components/seo/StructuredData";
import Loader from "@/components/layout/Loader";
import CursorGlow from "@/components/layout/CursorGlow";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StickyWhatsApp from "@/components/layout/StickyWhatsApp";
import ClientEffects from "@/components/layout/ClientEffects";
import "@/styles/globals.css";

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <StructuredData />
      </head>
      <body className={`${fontVariables} ${inter.className}`}>
        <Loader />
        <CursorGlow />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <StickyWhatsApp />
        <ClientEffects />
      </body>
    </html>
  );
}
