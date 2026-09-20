import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareerConnect - Top Student & Career Opportunities",
  description: "Discover hiring companies, explore internship and full-time career roles, review rich descriptions, and apply directly.",
  keywords: ["careers", "jobs", "internships", "employment", "hiring companies", "students", "graduates"],
  metadataBase: new URL("https://careerconnect.blog"),
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "mu5C37k-8Wp8f67Oc4Z92ocMwyxcWFLE0MFRst1J3yA",
  },
  openGraph: {
    title: "CareerConnect - Top Student & Career Opportunities",
    description: "Discover hiring companies, explore internship and full-time career roles, review rich descriptions, and apply directly.",
    url: "https://careerconnect.blog",
    siteName: "CareerConnect",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="google-site-verification" content="mu5C37k-8Wp8f67Oc4Z92ocMwyxcWFLE0MFRst1J3yA" />
        <meta name="google-adsense-account" content="ca-pub-7118174569250883" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7118174569250883"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
