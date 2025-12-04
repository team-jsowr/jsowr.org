import type { Metadata } from "next";
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
import { getSiteSettings } from "@/lib/contentful-api";
import "./globals.css";

export const metadata: Metadata = {
  title: "JSOWR - Jain Society of Waterloo Region",
  description: "Promoting Jain values, culture, and community service in the Waterloo Region.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {settings && <Navbar settings={settings} />}
        {children}
        {settings && <Footer settings={settings} />}
      </body>
    </html>
  );
}
