import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Mailing Online – Ihr Partner für Direktmailing",
  description: "Professionelle Mailings online bestellen: Selfmailer, Kuvertiertes Mailing, Kartenmailing – schnell, günstig und zuverlässig.",
  icons: {
    icon: "https://www.jopke.de/assets/images/icon/apple-touch-icon.png",
    apple: "https://www.jopke.de/assets/images/icon/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${openSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
