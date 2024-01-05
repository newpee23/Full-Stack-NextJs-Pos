import { Modal } from "antd"
import React, { useEffect, useState } from "react"
import ListOrderBill from "../list/ListOrderBill";

type Props = {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface btnActionType {
  btnTotalPrice: boolean;
  btnOrderHistory: boolean;
}

const ModalOrderHistory = ({ openModal, setOpenModal }: Props) => {

  const [btnAction, setBtnAction] = useState<btnActionType>({ btnOrderHistory: false, btnTotalPrice: false });

  useEffect(() => {
    if (openModal) {
      return setBtnAction({ btnOrderHistory: false, btnTotalPrice: false });
    }
  }, [openModal]);

  return (
    <Modal title="ยอดบิล (กดเพื่อทำรายการ)" open={openModal} footer={null} onCancel={() => setOpenModal(!openModal)}>
      <ListOrderBill btnAction={btnAction} setBtnAction={setBtnAction}/>
    </Modal>
  )
}

export default ModalOrderHistory