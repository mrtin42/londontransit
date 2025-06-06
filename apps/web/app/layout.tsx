import type { Metadata } from "next";
import { Geist, Geist_Mono, Ubuntu } from "next/font/google";
import Navbar from "./navbar";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false; // Prevent FontAwesome from adding its own CSS
import "./globals.css";
import Footer from "./footer";

const u = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LondonTransit",
  description: "Next stop: Your server.",
  openGraph: {
    title: "LondonTransit",
    description: "Next stop: Your server — LondonTransit brings live Transport for London data to your Discord server.",
  },
  twitter: {
    title: "LondonTransit",
    description: "Next stop: Your server — LondonTransit brings live Transport for London data to your Discord server.",
  },
};

export const viewport = {
  themeColor: "#060025",
  width: "device-width",
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background">
      <body
        className={`${u.className} antialiased bg-background`}
      >
        <Navbar />  
        {children}
        <Footer />
      </body>
    </html>
  );
}
