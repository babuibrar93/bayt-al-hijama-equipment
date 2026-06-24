import type { Metadata } from "next";
import { Toaster } from "sonner";
import { siteMetadata } from "@/lib/metadata";
import { fontVariables, inter } from "@/lib/fonts";
import { cn } from "@/lib/classes";
import { CartProvider } from "@/context/CartContext";
import "@/styles/globals.css";

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body
        className={cn(
          fontVariables,
          inter.className,
          "min-h-screen overflow-x-hidden bg-black font-body text-base leading-[1.7] text-white/80 antialiased",
        )}
      >
        <CartProvider>
          {children}
          <Toaster
            position="bottom-right"
            theme="dark"
            toastOptions={{
              style: {
                background: "rgba(5,12,8,0.96)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.9)",
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
