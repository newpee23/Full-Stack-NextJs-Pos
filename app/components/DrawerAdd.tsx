import { Button, Drawer, Form, Space } from "antd";
import { ReactNode, useState } from "react"
import AddBtn from "./UI/AddBtn";

type DrawerAddProps = {
    formContent: ReactNode; // ให้ DrawerAdd รับ prop ชื่อ formContent ที่มี type เป็น ReactNode
};

const DrawerAdd = ({ formContent }: DrawerAddProps) => {
    const [open, setOpen] = useState(false);
    
    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };
    
    return (
        <>
            <AddBtn onClick={showDrawer} label="เพิ่มข้อมูล"/>
            <Drawer title="Create a new account" width={720}
                onClose={onClose}
                open={open}
                styles={{ body: { paddingBottom: 80, }, }}
                extra={
                    <Space>
                        <Button onClick={onClose}>Cancel</Button>
                    </Space>
                }
            >
                {formContent}
            </Drawer>
        </>
    )
}

export default DrawerAdd