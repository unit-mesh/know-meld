import type { Metadata } from "next";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Layout } from "antd";
import { Geist, Geist_Mono } from "next/font/google";

import Header from "@/components/layout/Header";
import Sider, { MenuItem } from "@/components/layout/Sider";
import Content from "@/components/layout/Content";

import {
  ProjectOutlined,
  RocketOutlined,
  DatabaseOutlined,
  FileSyncOutlined,
  ProfileOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import "./globals.css";
import React from "react";

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

const headerTitle = "KnowMeld";

const menuItems: MenuItem[] = [
  {
    key: "lite",
    label: "Lite",
    icon: <RocketOutlined />,
    routeTo: "/lite",
  },
  {
    key: "prompt",
    label: "Prompt",
    icon: <FileSyncOutlined />,
    children: [
      {
        key: "propmt-list",
        label: "Prompt List",
        icon: <ProfileOutlined />,
        routeTo: "/prompt/prompt-list",
      },
      {
        key: "propmt-upload",
        label: "Prompt Upload",
        icon: <UploadOutlined />,
        routeTo: "/prompt/prompt-upload",
      },
    ],
  },
  {
    key: "workspace",
    label: "Workspace",
    icon: <ProjectOutlined />,
    children: [
      {
        key: "/workspace/feature/analysis",
        label: "Feature Analysis",
        icon: <RocketOutlined />,
        routeTo: "/workspace/feature/analysis",
      },
      {
        key: "/workspace/requirement/refinement",
        label: "Requirement Refinement",
        icon: <RocketOutlined />,
        routeTo: "/workspace/requirement/refinement",
      },
    ],
  },
  {
    key: "knowledge",
    label: "Knowledge",
    icon: <DatabaseOutlined />,
    children: [
      {
        key: "/knowledge/knowentry-list",
        label: "KnowEntry List",
        icon: <ProfileOutlined />,
        routeTo: "/knowledge/knowentry-list",
      },
      {
        key: "/knowledge/knowentry-upload",
        label: "KnowEntry Upload",
        icon: <UploadOutlined />,
        routeTo: "/knowledge/knowentry-upload",
      },
    ],
  },
];

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
            <Header style={{ display: "flex", alignItems: "center" }} headerTitle={headerTitle} />
            <Layout style={{ flex: 1, display: "flex", flexDirection: "row", overflow: "hidden" }}>
              <Sider width={240} style={{ overflow: "auto" }} menuItems={menuItems} />
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
