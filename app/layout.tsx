import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: {
    default: "NDA x UD Coalition",
    template: "%s | NDA x UD Coalition"
  },
  description:
    "Official website for the NDA x UD student coalition, focused on leadership, transparency, student welfare and giving every student a voice.",
  metadataBase: new URL("https://nda-ud-coalition.example"),
  openGraph: {
    title: "NDA x UD Coalition",
    description: "Your Voice. Our Responsibility. Together for Every Student.",
    images: ["/images/coalition-banner.jpeg"]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
