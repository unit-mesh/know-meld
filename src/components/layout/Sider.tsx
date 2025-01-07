"use client";

import Layout, { SiderProps } from "antd/lib/layout";
import { Menu, theme, Tooltip } from "antd";
import { usePathname, useRouter } from "next/navigation";
import {
  ProjectOutlined,
  RocketOutlined,
  SettingOutlined,
  NodeIndexOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import React from "react";

const Sider = Layout.Sider;

interface MenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  items?: MenuItem[];
  onClick?: () => void;
  disabled?: boolean;
}

export default function AntdSider(props: SiderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const items: MenuItem[] = [
    {
      key: "item-1",
      label: "Item 1",
      icon: <ProjectOutlined />,
      items: [
        {
          key: "item-1-sub-1",
          label: "Item 1 Sub 1",
          icon: <RocketOutlined />,
          onClick: () => router.push("/"),
        },
        {
          key: "item-1-sub-2",
          label: "Item 1 Sub 2",
          icon: <RocketOutlined />,
          onClick: () => router.push("/"),
        },
      ],
    },
    {
      key: "item-2",
      label: "Item 2",
      icon: <SettingOutlined />,
      items: [
        {
          key: "item-2-sub-1",
          label: "Item 2 Sub 1",
          icon: <NodeIndexOutlined />,
          onClick: () => router.push("/"),
        },
        {
          key: "item-2-sub-2",
          label: "Item 2 Sub 2",
          icon: <DatabaseOutlined />,
          onClick: () => router.push("/"),
        },
      ],
    }
  ];

  const renderMenuItem = (item: MenuItem) => {
    if (item?.items) {
      return (
        <Menu.SubMenu
          key={item.key}
          title={
            collapsed ? (
              <Tooltip placement="right" title={item.label}>
                {item.icon}
              </Tooltip>
            ) : (
              <>
                {item.icon}
                <span>{item.label}</span>
              </>
            )
          }
        >
          {item.items.map(renderMenuItem)}
        </Menu.SubMenu>
      );
    }

    return (<Menu.Item key={item.key} onClick={item.onClick} disabled={item.disabled} style={
      collapsed ? { paddingLeft: "24px" } : {}
    }>
      {collapsed ? (
        <Tooltip placement="right" title={item.label}>
          {item.icon}
        </Tooltip>
      ) : (
        <>
          {item.icon}
          <span>{item.label}</span>
        </>
      )}
    </Menu.Item>
    );
  };

  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <Sider
      collapsible
      collapsedWidth={80}
      onCollapse={setCollapsed}
      {...props} style={{
        background: colorBgContainer,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          defaultOpenKeys={["requirement", "knowledge"]}
        >
          {items.map(renderMenuItem)}
        </Menu>
      </div>
    </Sider>
  );
}
