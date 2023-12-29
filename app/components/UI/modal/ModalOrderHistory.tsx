import { Collapse, CollapseProps, Modal } from "antd"
import React, { useEffect, useState } from "react"

type Props = {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface btnActionType {
  btnTotalPrice: boolean;
  btnOrderHistory: boolean;
}

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const items: CollapseProps["items"] = [
  {
    key: "1",
    label: "This is panel header 1",
    children: <p>{text}</p>,
  },
  {
    key: "2",
    label: "This is panel header 2",
    children: <p>{text}</p>,
  },
  {
    key: "3",
    label: "This is panel header 3",
    children: <p>{text}</p>,
  },
];

const ModalOrderHistory = ({ openModal, setOpenModal }: Props) => {

  const [btnAction, setBtnAction] = useState<btnActionType>({ btnOrderHistory: false, btnTotalPrice: false });

  useEffect(() => {
    if (openModal) {
      return setBtnAction({ btnOrderHistory: false, btnTotalPrice: false });
    }
  }, [openModal]);

  const onChange = (key: string | string[]) => {
    console.log(key);
  };

  return (
    <Modal title="ยอดบิล (กดเพื่อทำรายการ)" open={openModal} footer={null} onCancel={() => setOpenModal(!openModal)}>
      <div className="flex justify-between items-center">
        <button onClick={() => setBtnAction(prevBtnAction => ({ ...prevBtnAction, btnTotalPrice: !btnAction.btnTotalPrice }))} type="button" className="text-orange-600 py-1 px-2 border rounded-md text-sm drop-shadow-md hover:bg-orange-700 hover:text-white hover:drop-shadow-xl whitespace-nowrap transition-transform transform hover:scale-105">
          <span className="ml-1">คำนวนยอดบิล</span>
        </button>
        {btnAction.btnTotalPrice && <p>ยอดสุทธิ : 10000 บาท</p>}
      </div>
      <div className="mt-3">
        <button onClick={() => setBtnAction(prevBtnAction => ({ ...prevBtnAction, btnOrderHistory: !btnAction.btnOrderHistory }))} type="button" className="text-orange-600 py-1 px-2 border rounded-md text-sm drop-shadow-md hover:bg-orange-700 hover:text-white hover:drop-shadow-xl whitespace-nowrap transition-transform transform hover:scale-105">
          <span className="ml-1">ประวัติการสั่งอาหาร</span>
        </button>
        {btnAction.btnOrderHistory && <Collapse className="mt-3" items={items} onChange={onChange} size="small" />}
      </div>
    </Modal>
  )
}

export default ModalOrderHistory