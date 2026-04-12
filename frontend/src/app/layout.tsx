import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import { UserProvider } from "@/context/user-context";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OmniChat - Premium Omnichannel Solution",
  description: "Manage all your customer conversations in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col selection:bg-primary/20">
        <UserProvider>
          {children}
          <Toaster position="top-right" richColors toastOptions={{ className: 'font-outfit' }} />
        </UserProvider>
      </body>
    </html>
  );
}
