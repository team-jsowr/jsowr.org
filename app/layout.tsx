import type { Metadata } from "next";
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
import { getSiteSettings } from "@/lib/contentful-api";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://jsowr.org"),
  title: {
    default: "Jain Society of Waterloo Region",
    template: "%s | JSOWR",
  },
  description: "Promoting Jain values, culture, and community service in the Waterloo Region.",
  openGraph: {
    siteName: "Jain Society of Waterloo Region",
    type: "website",
    locale: "en_CA",
  },
  twitter: {
    card: "summary",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Cormorant+Garamond:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-sans">
        {settings && <Navbar settings={settings} />}
        {children}
        {settings && <Footer settings={settings} />}
      </body>
    </html>
  );
}
