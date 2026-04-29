import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MedKeep — Reduza faltas e mantenha sua agenda sempre cheia",
  description:
    "MedKeep automatiza confirmações de consultas e exames no WhatsApp. Reduza faltas, aumente o faturamento e libere sua recepção.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} bg-brand-bg font-sans text-brand-ink antialiased`}>
        {children}
      </body>
    </html>
  );
}
