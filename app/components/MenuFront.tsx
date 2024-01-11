import React, { useState } from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { productDataCustomerFrontData } from "@/types/fetchData";
import ModalOrderHistory from "./UI/modal/ModalOrderHistory";

type MenuItem = Required<MenuProps>["items"][number];

interface MenuPageProps {
    productType: productDataCustomerFrontData[];
}

const getItem = (
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: "group",
): MenuItem => {
    return { key, icon, children, label, type } as MenuItem;
};

const MenuFront = ({ productType }: MenuPageProps) => {
  
    const [openModal , setOpenModal] = useState<boolean>(false);
    const handleMenuItemClick = (key: React.Key) => {
        // Scroll to the corresponding section
        const sectionId = `/product/${key.toString()}`;
        const section = document.getElementById(sectionId);

        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    const items: MenuItem[] = [
        ...productType.map((product) =>
            getItem(product.name, product.id.toString())
        ),
    ];

    return (
        <section style={{ borderInlineEnd: "1px solid rgba(5, 5, 5, 0.06)" }}>
            <button type="button" onClick={() => setOpenModal(!openModal)} className="w-11/12 m-1 mt-3 flex items-center py-2 justify-center text-orange-600 border rounded-md text-sm drop-shadow-md hover:bg-orange-600 hover:text-white hover:drop-shadow-xl whitespace-nowrap transition-transform transform hover:scale-105">
                <span className="font-thin">ยอดบิล</span>
            </button>

            <Menu
                onClick={({ key }) => handleMenuItemClick(key)}
                defaultSelectedKeys={["1"]}
                mode="inline"
                inlineCollapsed={false}
                items={items}
                className={`h-[100vh] max-w-[100px] z-0`}
                style={{ borderInlineEnd: "0" }}
            />

            <ModalOrderHistory openModal={openModal} setOpenModal={setOpenModal}/>
        </section>
    );
};

export default MenuFront;
