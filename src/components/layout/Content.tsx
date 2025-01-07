"use client";

import Layout, { SiderProps } from "antd/lib/layout";
const Content = Layout.Content;

export default function AntContent(props: SiderProps) {
  return <Content {...props} />;
}
