import { fetchCustomerFrontData } from "@/types/fetchData";
import { Modal } from "antd";
import ListCartOrderItem from "../list/ListCartOrderItem";
import { useAppSelector } from "@/app/store/store";

interface Props {
    openCart: boolean;
    setOpenCart: React.Dispatch<React.SetStateAction<boolean>>;
    orderDetail: fetchCustomerFrontData;
}

const ModalCart = ({ openCart, setOpenCart, orderDetail }: Props) => {
    const { itemCart , totalQty } = useAppSelector((state) => state?.cartSlice);

    return (
        <Modal title={`ตระกร้าสินค้า (${orderDetail.tablesData.name})`} open={openCart} footer={null} onCancel={() => setOpenCart(false)}>
            <div className="w-full flex justify-between">
                <p>รายการสินค้า {itemCart.length} รายการ</p>
                <p>จำนวน {totalQty} ชิ้น</p>
            </div>
            <div className="mt-2">
               <ListCartOrderItem setOpenCart={setOpenCart}/>
            </div>
        </Modal>
    );
};

export default ModalCart;
