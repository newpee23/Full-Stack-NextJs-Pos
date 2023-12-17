import { DeleteOutlined } from '@ant-design/icons';

import React, { useState } from 'react';
import { Modal } from 'antd';
type Props = {
  label: string;
  name?: string;
  bill? : boolean;
  onClick: () => void;
};

const DeleteBtn = ({ label, name ,onClick, bill }: Props) => {
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
      <button
        type="button"
        onClick={handleShowModal}
        className="text-red-500 m-1 py-2 px-3 border rounded-md text-sm drop-shadow-md hover:bg-red-600 hover:text-white hover:drop-shadow-xl whitespace-nowrap transition-transform transform hover:scale-105"
      >
        <DeleteOutlined />
        <span className="ml-1">{label}</span>
      </button>
      <Modal
        title={bill ? "แจ้งเตือนการปิดบิลขาย" : "แจ้งเตือนการลบข้อมูล"}
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

export default DeleteBtn