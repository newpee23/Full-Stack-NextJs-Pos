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

const MenuFront = ({ onMenuClick }: MenuPageProps) => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const handleMenuItemClick = (key: React.Key) => {
        // ให้เรียก callback function ที่ถูกส่งมาจาก parent component
        onMenuClick(key);
    };

    const items: MenuItem[] = [
        getItem("เปิดบิลขาย", "1", <PieChartOutlined />),
        getItem("สาขา", "2", <DesktopOutlined />),
        getItem("โต๊ะ", "3", <ContainerOutlined />),
    ];

    return (
        <section>
            <div className={`p-2 pb-1 ${!collapsed ? "w-36" : "w-20"} bg-white border-inline-end flex items-center justify-end`} style={{ borderInlineEnd: "1px solid rgba(5, 5, 5, 0.06)" }}>
                <Button onClick={toggleCollapsed} className={`flex items-center justify-center ${collapsed && "w-full"}`}>
                    {collapsed ? <MenuUnfoldOutlined onClick={toggleCollapsed} /> : <MenuFoldOutlined onClick={toggleCollapsed} />}
                </Button>
            </div>

            <Menu
                onClick={({ key }) => handleMenuItemClick(key)}
                defaultSelectedKeys={["1"]}
                mode="inline"
                inlineCollapsed={collapsed}
                items={items}
                className={`h-[100vh] z-0 ${!collapsed && "w-36"}`}
            />
        </section>
    );
};

export default MenuFront;