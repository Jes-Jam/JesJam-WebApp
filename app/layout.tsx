import type { Metadata } from "next";
import "./globals.css";
import { Rubik } from "next/font/google";

const font = Rubik({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JesJam WebApp",
  description: "Flashcards for learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${font.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
