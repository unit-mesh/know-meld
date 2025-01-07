"use client";

import Layout, { SiderProps } from "antd/lib/layout";
import { Menu, theme, Tooltip } from "antd";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const Sider = Layout.Sider;

interface MenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  items?: MenuItem[];
  routeTo?: string;
  disabled?: boolean;
}

export default function AntdSider(props: SiderProps & { menus: MenuItem[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

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

    return (<Menu.Item key={item.key} onClick={() => item.routeTo && router.push(item.routeTo)} disabled={item.disabled} style={
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
          {props.menus.map(renderMenuItem)}
        </Menu>
      </div>
    </Sider>
  );
}
