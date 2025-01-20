"use client";

import { Button, Drawer, Layout, LayoutProps } from "antd";
import Link from "next/link";
import { useState } from "react";
import AIChat from "../chat/AIChat";
import { CommentOutlined } from "@ant-design/icons";

const { Header } = Layout;

export default function AntdHeader(props: LayoutProps & { headerTitle: string }) {
  const { headerTitle, ...otherProps } = props;

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

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
        <Button type="link" icon={< CommentOutlined />} onClick={showDrawer}/>
        <Drawer title="AI Chat" onClose={onClose} open={open}>
          <AIChat />
        </Drawer>
      </div>
    </Header >
  );
}
