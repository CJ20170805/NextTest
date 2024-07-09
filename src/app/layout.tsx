import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import '@mantine/core/styles.css';
import { ColorSchemeScript } from '@mantine/core'
import { createTheme, MantineProvider } from '@mantine/core';
import { SpeedInsights } from "@vercel/speed-insights/next"

const theme = createTheme({
  //colorScheme: 'dark',
});


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FE888",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SpeedInsights/>
      <head>
        <ColorSchemeScript />
      </head>

      <body className={inter.className}>
        <MantineProvider theme={theme}>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
