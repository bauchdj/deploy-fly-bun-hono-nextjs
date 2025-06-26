import promoImage from "../../public/images/preview.png";
import { Geist, Geist_Mono } from "next/font/google";
import { siteConfig } from "../utils/site-config";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	keywords: ["bun", "hono", "nextjs", "api", "demo", "fly", "flyctl", "fly.io"],
	title: {
		default: siteConfig.name,
		template: `%s | ${siteConfig.name}`,
	},
	description: siteConfig.description,
	metadataBase: new URL(siteConfig.url as string),
	openGraph: {
		title: siteConfig.name,
		description: siteConfig.description,
		url: siteConfig.url,
		siteName: siteConfig.name,
		images: [
			{
				url: promoImage.src,
				width: promoImage.width,
				height: promoImage.height,
				alt: siteConfig.name,
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		title: siteConfig.name,
		description: siteConfig.description,
		site: siteConfig.twitterHandle,
		card: "summary_large_image",
		images: [
			{
				url: promoImage.src,
				width: promoImage.width,
				height: promoImage.height,
				alt: siteConfig.name,
			},
		],
	},
	robots: {
		index: true,
		follow: true,
		nocache: false,
		googleBot: {
			index: true,
			follow: true,
			noimageindex: false,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
		</html>
	);
}
