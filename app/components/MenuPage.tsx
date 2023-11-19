import React, { useState } from "react";
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Menu } from "antd";
import "@/app/components/menuPage.css";

type MenuItem = Required<MenuProps>["items"][number];

interface MenuPageProps {
  onMenuClick: (key: React.Key) => void;
}

const getItem = (label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[], type?: "group",): MenuItem => {
  return { key, icon, children, label, type, } as MenuItem;
}

const MenuPage = ({ onMenuClick }: MenuPageProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuItemClick = (key: React.Key) => {
    // ให้เรียก callback function ที่ถูกส่งมาจาก parent component
    onMenuClick(key);
  };

  const items: MenuItem[] = [

    getItem("Option 1", "1", <PieChartOutlined />),
    getItem("สาขา", "2", <DesktopOutlined />),
    getItem("Option 3", "3", <ContainerOutlined />),

    getItem("Navigation One", "sub1", <MailOutlined />, [
      getItem("Option 5", "5"),
      getItem("Option 6", "6"),
      getItem("Option 7", "7"),
      getItem("Option 8", "8"),
    ]),

    getItem("Navigation Two", "sub2", <AppstoreOutlined />, [
      getItem("Option 9", "9"),
      getItem("Option 10", "10"),

      getItem("Submenu", "sub3", null, [getItem("Option 11", "11"), getItem("Option 12", "12")]),
    ]),

    getItem("LogOut", "13", <ContainerOutlined />),
  ];

  return (
    <section>
      <div className="p-2 pb-1 bg-white border-inline-end flex items-center justify-end">
        {/* <div className="w-full max-w-[180px]">
          <p className="overflow-hidden whitespace-nowrap overflow-ellipsis">บริษัท นิวจำกัด</p>
        </div> */}
        <Button onClick={toggleCollapsed} className={`flex items-center justify-center ${collapsed && "w-full"}`}>
          {collapsed ? <MenuUnfoldOutlined onClick={toggleCollapsed}/> : <MenuFoldOutlined onClick={toggleCollapsed}/>}
        </Button>
      
      </div>
      <Menu
        onClick={({ key }) => handleMenuItemClick(key)}
        defaultSelectedKeys={["1"]}
        // defaultOpenKeys={["sub1"]}
        mode="inline"
        inlineCollapsed={collapsed}
        items={items}
        className={`h-[100vh] z-0 ${!collapsed && "w-64"}`}
      />
    </section>
  );
};

export default MenuPage;