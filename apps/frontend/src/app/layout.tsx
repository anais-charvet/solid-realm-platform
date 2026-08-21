import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});
const aujournuit = localFont({
  src: './fonts/Aujournuit-VariableVF.woff2',
  variable: '--font-aujournuit',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Solid Realm',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${aujournuit.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
