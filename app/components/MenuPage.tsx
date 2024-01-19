import React, { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { RiAddBoxFill, RiBillFill , RiHome3Fill } from "react-icons/ri";
import { FaBoxArchive } from "react-icons/fa6";
import { FaHouseUser, FaSignOutAlt, FaUser, FaUserPlus } from "react-icons/fa";
import { BiLogoPaypal, BiSolidReport } from "react-icons/bi";
import { MdTableRestaurant } from "react-icons/md";
import type { MenuProps } from "antd";
import { Button, Menu } from "antd";
import { useSession } from "next-auth/react";

type MenuItem = Required<MenuProps>["items"][number];

interface MenuPageProps {
  onMenuClick: (key: React.Key) => void;
}

const getItem = (label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[], type?: "group",): MenuItem => {
  return { key, icon, children, label, type, } as MenuItem;
}

const MenuPage = ({ onMenuClick }: MenuPageProps) => {

  const [collapsed, setCollapsed] = useState(false);
  const { data: session } = useSession();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuItemClick = (key: React.Key) => {
    // ให้เรียก callback function ที่ถูกส่งมาจาก parent component
    onMenuClick(key);
  };

  const items: MenuItem[] = [
    session?.user.role === "userAdmin" || session?.user.role === "user" ? getItem("เปิดบิลขาย", "1", <RiBillFill />) : null,
    session?.user.role === "userAdmin" ? getItem("สาขา", "2", <RiHome3Fill />) : null,
    session?.user.role === "userAdmin" ? getItem("โต๊ะ", "3", <MdTableRestaurant />) : null,
    session?.user.role === "userAdmin" ? getItem("ข้อมูลผู้ใช้", "sub1", <FaUser />, [ getItem("ตำแหน่ง", "5"), getItem("พนักงาน", "6") ]) : null,
    session?.user.role === "userAdmin" ? getItem("ค่าใช้จ่าย", "sub2", <BiLogoPaypal />, [ getItem("หัวข้อค่าใช้จ่าย", "7"), getItem("บันทึกค่าใช้จ่าย", "8") ]) : null,
    session?.user.role === "userAdmin" ? getItem("ข้อมูลสินค้า", "sub3", <FaBoxArchive />, [ getItem("ประเภทสินค้า", "11"), getItem("หน่วยนับ", "12"), getItem("ข้อมูลสินค้า", "14") ]) : null,
    session?.user.role === "userAdmin" ? getItem("โปรโมชั่น", "sub4", <RiAddBoxFill />, [ getItem("หัวข้อโปรโมชั่น", "15"), getItem("บันทึกโปรโมชั่น", "16") ]) : null,
    session?.user.role === "userAdmin" ? getItem("รายงาน", "sub5", <BiSolidReport />, [ getItem("รายงานสรุปยอดขายประจำสาขา", "17"), getItem("รายงานค่าใช้จ่ายประจำสาขา", "18") ]) : null,
    session?.user.role === "admin" ? getItem("ข้อมูลบริษัท", "19", <RiHome3Fill />) : null,
    session?.user.role === "admin" ? getItem("ข้อมูลสาขา", "20", <FaHouseUser />) : null,
    session?.user.role === "admin" ? getItem("ข้อมูลผู้ใช้ประจำสาขา", "21", <FaUserPlus />) : null,
    getItem("LogOut", "13", <FaSignOutAlt />),
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