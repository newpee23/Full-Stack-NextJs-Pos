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
    getItem("โต๊ะ", "3", <ContainerOutlined />),

    getItem("ข้อมูลผู้ใช้", "sub1", <MailOutlined />, [
      getItem("ตำแหน่ง", "5"),
      getItem("พนักงาน", "6"),
    ]),

    getItem("ค่าใช้จ่าย", "sub2", <AppstoreOutlined />, [
      getItem("หัวข้อค่าใช้จ่าย", "7"),
      getItem("บันทึกค่าใช้จ่าย", "8"),
    ]),
    getItem("ข้อมูลสินค้า", "sub3", null, [
      getItem("ประเภทสินค้า", "11"),
      getItem("หน่วยนับ", "12"),
      getItem("ข้อมูลสินค้า", "14"),
    ]),
    getItem("โปรโมชั่น", "sub4", null, [
      getItem("หัวข้อโปรโมชั่น", "15"),
      getItem("บันทึกโปรโมชั่น", "16"),
    ]),
    getItem("LogOut", "13", <ContainerOutlined />),
  ];

  return (
    <section>
      <div className="p-2 pb-1 bg-white border-inline-end flex items-center justify-end">
        <Button onClick={toggleCollapsed} className={`flex items-center justify-center ${collapsed && "w-full"}`}>
          {collapsed ? <MenuUnfoldOutlined onClick={toggleCollapsed}/> : <MenuFoldOutlined onClick={toggleCollapsed}/>}
        </Button>
      
      </div>
      <Menu
        onClick={({ key }) => handleMenuItemClick(key)}
        defaultSelectedKeys={["1"]}
        mode="inline"
        inlineCollapsed={collapsed}
        items={items}
        className={`h-[100vh] z-0 ${!collapsed && "w-64"}`}
      />
    </section>
  );
};

export default MenuPage;