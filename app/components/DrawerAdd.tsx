import { Button, Drawer, Form, Space } from "antd";
import { ReactNode, useState } from "react"
import AddBtn from "./UI/AddBtn";

type DrawerAddProps = {
    formContent: ReactNode; // ให้ DrawerAdd รับ prop ชื่อ formContent ที่มี type เป็น ReactNode
    title: string;
    showError: { message: string }[];
};

const DrawerAdd = ({ formContent, title, showError }: DrawerAddProps) => {
    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    return (
        <>
            <AddBtn onClick={showDrawer} label="เพิ่มข้อมูล" />
            <Drawer title={title} width={720}
                onClose={onClose}
                open={open}
                styles={{ body: { paddingBottom: 80, }, }}
                extra={
                    <Space>
                        <Button onClick={onClose} >ยกเลิก</Button>
                    </Space>
                }
            >
                {formContent}
                <ul>
                    {showError.map((error, index) => (
                        <li key={index}>{error.message}</li>
                    ))}
                </ul>
            </Drawer>
        </>
    )
}

export default DrawerAdd