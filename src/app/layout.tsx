import type { Metadata } from "next";
import { Poppins, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { dark } from '@clerk/themes';
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from '@clerk/nextjs';

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aarogya AI",
  description:
    "Aarogya.me – Your AI-Powered Personal Health Assistant. Discover smarter healthcare with Aarogya.me – an AI-powered platform that helps you manage medications, consult doctors, store prescriptions, and track your health effortlessly. Voice-enabled, prescription-aware, and designed for all—even the visually impaired. Stay healthy, stay informed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html
        lang="en"
        className={`${poppins.variable} ${spaceGrotesk.variable}`}
        suppressHydrationWarning
      >
        <head>
          <link rel="icon" href="favicon.ico" />
          <style>{`
    * {
      font-family: 'Poppins', sans-serif !important;
    }
  `}</style>
        </head>
        <body className="bg-black font-sans">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
