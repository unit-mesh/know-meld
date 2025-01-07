import type { Metadata } from "next";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Layout } from "antd";
import { Geist, Geist_Mono } from "next/font/google";

import Header from "@/components/layout/Header";
import Sider from "@/components/layout/Sider";
import Content from "@/components/layout/Content";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KnowMeld",
  description: "KnowMeld: AI-powered knowledge management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AntdRegistry>
          <Layout style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <Header style={{ display: "flex", alignItems: "center" }} />
            <Layout style={{ flex: 1, display: "flex", flexDirection: "row", overflow: "hidden" }}>
              <Sider width={240} style={{ overflow: "auto" }} />
              <Layout
                style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "auto" }}>
                <Content
                  style={{
                    margin: 0,
                    minHeight: 280,
                  }}
                >
                  {children}
                </Content>
              </Layout>
            </Layout>
          </Layout>
        </AntdRegistry>
      </body>
    </html>
  );
}
