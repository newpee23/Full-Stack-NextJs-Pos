import { Button, Drawer, Space } from "antd";
import { ReactNode, useState } from "react"
import AddBtn from "./UI/AddBtn";
import ErrFrom from "./ErrFrom";
import EditBtn from "./UI/EditBtn";

type DrawerAddProps = {
    formContent: ReactNode; // ให้ DrawerAdd รับ prop ชื่อ formContent ที่มี type เป็น ReactNode
    title: string;
    showError: { message: string }[];
    statusAction: "add" | "update";
    resetForm: () => void;
};

const DrawerActionData = ({ formContent, title, showError, statusAction , resetForm }: DrawerAddProps) => {
    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        resetForm();
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    return (
        <div>
            {statusAction === "add" ? <AddBtn onClick={showDrawer} label="เพิ่มข้อมูล" /> : <EditBtn onClick={showDrawer} label="แก้ไขข้อมูล"/>}
            
            <Drawer title={title} width={800} onClose={onClose} open={open} styles={{ body: { paddingBottom: 80, }, }}
                extra={
                    <Space>
                        <Button onClick={onClose} >ยกเลิก</Button>
                    </Space>
                }
            >
                {formContent}
                {showError.length > 0 && <ErrFrom showError={showError}/>}
            </Drawer>
        </div>
    )
}

export default DrawerActionData;