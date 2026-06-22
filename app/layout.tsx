import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Cafe Crown — Where Every Flavour Tells A Story | Lucknow",
  description:
    "Cafe Crown in Lucknow serves premium vegetarian food at budget-friendly prices. Try our signature cold coffees, burgers, maggi, pasta & more. Open 11 AM – 10 PM.",
  keywords: [
    "Cafe Crown Lucknow",
    "cafe near Bharwara Crossing",
    "vegetarian cafe Lucknow",
    "budget cafe Lucknow",
    "coffee Lucknow",
    "maggi Lucknow",
    "burgers Lucknow",
  ],
  authors: [{ name: "Cafe Crown" }],
  openGraph: {
    title: "Cafe Crown — Where Every Flavour Tells A Story",
    description:
      "Premium vegetarian cafe in Lucknow. Budget-friendly food, cozy ambience, 4.8★ rated.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#2D5A3D" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ThemeProvider>
          <CartProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <Toaster
              position="bottom-center"
              toastOptions={{
                className: "toast-success",
                duration: 3000,
                style: {
                  background: "#2D5A3D",
                  color: "#fff",
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 500,
                  borderRadius: "9999px",
                  padding: "12px 20px",
                },
              }}
            />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
