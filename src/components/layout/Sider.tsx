"use client";

import Layout, {SiderProps} from "antd/lib/layout";
import {Menu, MenuProps, theme } from "antd";
import {usePathname, useRouter} from "next/navigation";
import React from "react";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

const Sider = Layout.Sider;

export type MenuItem = Required<MenuProps>['items'][number] & { routeTo?: string, children?: MenuItem[] };

const replaceRouteToWithOnClick = (menuItem: MenuItem[], push: AppRouterInstance['push']): MenuItem[] => {
  return menuItem.map((item) => {
    const {routeTo, ...newItem} = item;

    if (item.children) {
      return {
        ...newItem,
        children: replaceRouteToWithOnClick(item.children, push),
      };
    }

    return {
      ...newItem,
      onClick: () => {
        if (item.routeTo) {
          push(item.routeTo);
        }
      },
    };
  });
}

export default function AntdSider(props: SiderProps & { menuItems: MenuItem[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const newMenuItems = replaceRouteToWithOnClick(props.menuItems, router.push);
  const {
    token: {colorBgContainer},
  } = theme.useToken();

  return (
    <Sider
      collapsible
      collapsedWidth={80}
      {...props} style={{
      background: colorBgContainer,
      display: "flex",
      flexDirection: "column",
      height: "100%",
    }}>
      <div style={{display: "flex", flexDirection: "column", height: "100%"}}>
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          items={newMenuItems}
        />
      </div>
    </Sider>
  );
}
