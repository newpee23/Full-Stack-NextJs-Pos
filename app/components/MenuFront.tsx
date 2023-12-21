import React, { useState } from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import "@/app/components/menuPage.css";
import { productDataCustomerFrontData } from "@/types/fetchData";

type MenuItem = Required<MenuProps>["items"][number];

interface MenuPageProps {
    onMenuClick: (key: React.Key) => void;
    productType: productDataCustomerFrontData[];
}

const getItem = (label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[], type?: "group",): MenuItem => {
    return { key, icon, children, label, type, } as MenuItem;
}

const MenuFront = ({ onMenuClick , productType }: MenuPageProps) => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const handleMenuItemClick = (key: React.Key) => {
        // ให้เรียก callback function ที่ถูกส่งมาจาก parent component
        onMenuClick(key);
    };

    const items: MenuItem[] = [
        ...productType.map((product) =>
            getItem(product.name, product.id.toString())
        ),
    ];

    return (
        <section style={{ borderInlineEnd: "1px solid rgba(5, 5, 5, 0.06)" }}>
            <button type="button" className="w-11/12 m-1 mt-2 flex items-center py-2 justify-center text-orange-600 border rounded-md text-sm drop-shadow-md hover:bg-orange-600 hover:text-white hover:drop-shadow-xl whitespace-nowrap transition-transform transform hover:scale-105">
                <span className="font-thin">สรุปยอด</span>
            </button>

            <Menu
                onClick={({ key }) => handleMenuItemClick(key)}
                defaultSelectedKeys={["1"]}
                mode="inline"
                inlineCollapsed={false}
                items={items}
                className={`h-[100vh] max-w-[100px] z-0 ${!collapsed && "w-36"}`}
                style={{ borderInlineEnd: "0" }}
            />
        </section>
    );
};

export default MenuFront;