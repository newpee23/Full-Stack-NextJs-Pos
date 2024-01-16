import React, { useState } from 'react';
import { Modal } from 'antd';
import { IoMdPrint } from 'react-icons/io';
import { MdCancel } from 'react-icons/md';
type Props = {
    name?: string;
    onClick: () => void;
};

const CancelBtnBill = ({ name, onClick }: Props) => {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState(name);

    const handleShowModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setModalText("กำลังประมวลผล");
        setConfirmLoading(true);
        onClick();
    };

    const handleCancel = () => {
        setOpen(false);
    };
    return (
        <>
            <button type="button" onClick={handleShowModal} className="text-red-700 py-1 px-2 mr-1 border rounded-md text-sm drop-shadow-md hover:bg-red-600 hover:text-white hover:drop-shadow-xl whitespace-nowrap transition-transform transform hover:scale-105">
                <span className="flex items-center">
                    <MdCancel className="mr-1"/> ยกเลิกออเดอร์
                </span>
            </button>
            <Modal
                title={"แจ้งเตือนการยกเลิกออเดอร์"}
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                okText="ยืนยัน"
                cancelText="ยกเลิก"
            >
                <p>{modalText}</p>
            </Modal>
        </>
    );
}

export default CancelBtnBill;