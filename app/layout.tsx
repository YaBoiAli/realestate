import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LocalPRO Listing Flow",
  description: "Internal listing operations workflow demo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
