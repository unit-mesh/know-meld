"use client";

import { Layout, LayoutProps } from "antd";
import Link from "next/link";

const { Header } = Layout;

export default function AntdHeader(props: LayoutProps & { headerTitle: string }) {
    const { headerTitle, ...otherProps } = props;

  return (
    <Header
      {...otherProps}
      className="flex items-center justify-between px-4 bg-background text-foreground"
      style={{
        ...props.style,
        height: 64,
        lineHeight: "64px",
      }}
    >
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-lg font-semibold text-white hover:text-gray-300 transition-colors">
          {props.headerTitle}
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <Link href="/misc/overview" className="text-white hover:text-gray-300 transition-colors">
          Overview
        </Link>
      </div>
    </Header>
  );
}
