import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "RedBus Clone - Book Bus Tickets Online",
  description: "Book your bus tickets easily with RedBus Clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <VisualEditsMessenger />
        <footer className="border-t py-8 bg-zinc-50 dark:bg-zinc-900">
          <div className="container mx-auto px-4 text-center text-zinc-500">
            <p>© 2025 RedBus Clone. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
