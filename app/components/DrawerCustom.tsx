import { Button, Drawer, Space } from "antd";
import { ReactNode, useState } from "react"
import AddBtn from "./UI/btn/AddBtn";
import ErrFrom from "./ErrFrom";
import EditBtn from "./UI/btn/EditBtn";

type DrawerAddProps = {
    formContent: ReactNode; // ให้ DrawerAdd รับ prop ชื่อ formContent ที่มี type เป็น ReactNode
    title: string;
    titleBtn: string;
    showError: { message: string }[];
    statusAction: "add" | "update";
    resetForm: () => void;
};

const DrawerCustom = ({ formContent, title, showError, statusAction , resetForm , titleBtn}: DrawerAddProps) => {
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
            {statusAction === "add" ? <AddBtn onClick={showDrawer} label={titleBtn} /> : <EditBtn onClick={showDrawer} label={titleBtn}/>}
            
            <Drawer title={title} width={900} onClose={onClose} open={open} styles={{ body: { paddingBottom: 60, }, }}
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

export default DrawerCustom;