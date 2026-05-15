import type { Metadata } from "next";
import { ObservabilityProvider } from "./observability-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Delivery Admin",
  description: "Internal operations console for the delivery platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ObservabilityProvider />
        {children}
      </body>
    </html>
  );
}
