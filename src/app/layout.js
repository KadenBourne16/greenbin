import { Urbanist } from "next/font/google";
import "./globals.css";

const urbanist = Urbanist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-urbanist',
});

export const metadata = {
  title: "Greenbin",
  description: "GreenBin, a smart way to recycle.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${urbanist.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}