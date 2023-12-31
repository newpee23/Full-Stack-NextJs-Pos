import { cartPromotionIncrementItem } from '@/app/store/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { detailPromotion } from '@/types/fetchData';
import { Modal, message } from 'antd';
import React from 'react'

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectItemPromotion: detailPromotion | undefined;
}

const AddModalPromotion = ({ open, setOpen, selectItemPromotion }: Props) => {

  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const { itemCart } = useAppSelector((state) => state?.cartSlice);

  if (!selectItemPromotion) {
    return (
      <Modal
        title="ไม่พบข้อมูลโปรโมชั่นสินค้า"
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        okText="ตกลง"
        cancelText="ยกเลิก"
      >
        <p>ขออภัยไม่พบสินค้าที่ท่านเลือก</p>
      </Modal>
    );
  }

  const showMessage = ({ status, text }: { status: string, text: string }) => {
    if (status === "success") { messageApi.success(text); }
    else if (status === "error") { messageApi.error(text); }
    else if (status === "warning") { messageApi.warning(text); }
  };

  const handlePromotionIncrement = () => {
    const promotionItem = itemCart.find(item => item.promotionId === selectItemPromotion.promotionId);
    if (!promotionItem) {
      setOpen(false);   
      return dispatch(cartPromotionIncrementItem({ promotionId: selectItemPromotion.promotionId, name: selectItemPromotion.name, qty: 1, price: selectItemPromotion.promotionPrice, image: selectItemPromotion.img }));
    }
    showMessage({ status: "error", text: "โปรโมชั่น 1 ตัวสามารถเพิ่มได้เพียง 1 ครั้งต่อ 1 บิล" });
  }

  return (
    <>
      <Modal
        title={selectItemPromotion.name}
        open={open}
        onOk={() => handlePromotionIncrement()}
        onCancel={() => setOpen(false)}
        okText="เพิ่มสินค้า"
        cancelText="ยกเลิก"
      >
        <div>
          <p>รายละเอียด</p>
          <div className="text-xs">
            <p className="ml-2">{selectItemPromotion.detail}</p>
          </div>
        </div>

      </Modal>
      {contextHolder}
    </>
  )
}

export default AddModalPromotion