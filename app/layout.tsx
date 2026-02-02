import localFont from "next/font/local";
import { headers } from "next/headers";
import type { Metadata } from "next";
import "./globals.css";
import LayoutClient from "@/components/layout";
import Providers from "./providers";

const pretendard = localFont({
  src: "../public/font/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "system-ui",
    "Roboto",
    "Helvetica Neue",
    "Segoe UI",
    "Apple SD Gothic Neo",
    "Noto Sans KR",
    "Malgun Gothic",
    "Apple Color Emoji",
    "Segoe UI Emoji",
    "Segoe UI Symbol",
    "sans-serif",
  ],
});

const siteTitle = "융합소프트웨어 비상대책위원회";
const siteDescription =
  "명지대학교 융합소프트웨어학부의 변화를 이끄는 학생 자치 기구";

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://recruit.bluerack.org";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: siteTitle,
  description: siteDescription,
  icons: {
    icon: "/logos/mjuSWLogo.png",
    shortcut: "/logos/mjuSWLogo.png",
    apple: "/logos/mjuSWLogo.png",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: "website",
    url: baseUrl,
    siteName: siteTitle,
    images: [
      {
        url: "/logos/mjuSWLogo.png",
        width: 512,
        height: 512,
        alt: siteTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/logos/mjuSWLogo.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const isAdminHost = host.startsWith("admin.");

  return (
    <html lang="ko" className={`${pretendard.variable}`}>
      <body className="font-pretendard antialiased">
        <Providers>
          <LayoutClient isAdminHost={isAdminHost}>{children}</LayoutClient>
        </Providers>
      </body>
    </html>
  );
}
