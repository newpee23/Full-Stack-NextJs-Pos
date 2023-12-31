import React, { useEffect, useState } from 'react';
import { InputNumber, Modal } from 'antd';
import { productData } from '@/types/fetchData';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { cartIncrementItem } from '@/app/store/slices/cartSlice';

interface Props {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectProduct: productData | undefined;
}

const AddModalProduct: React.FC<Props> = ({ open, setOpen, selectProduct }) => {

    const dispatch = useAppDispatch();
    const [value, setValue] = useState<number>(0);
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        if (open) {
            setValue(0);
        }
    }, [open]);

    if (!selectProduct) {
        return (
            <Modal
                title="ไม่พบข้อมูลสินค้า"
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

    const handleIncrement = () => {
        if (value < selectProduct.stock) {
            setValue(value + 1);
            setMessage("");
        }
    };

    const handleDecrement = () => {
        if (value > 0) {
            setValue(value - 1);
            setMessage("");
        }
    };

    const handleOk = () => {
        if(value > 0){
            dispatch(cartIncrementItem({productId: selectProduct.id , name: selectProduct.name , price: selectProduct.price , qty: value , image: selectProduct.img}));
            return setOpen(false);
        }
        setMessage("กรุณาเพิ่มสินค้า");
    }

    return (
        <Modal
            title={selectProduct.name}
            open={open}
            onOk={handleOk}
            onCancel={() => setOpen(false)}
            okText="เพิ่มสินค้า"
            cancelText="ยกเลิก"
        >
            <div className="flex items-center justify-between">
                <p className="w-[60px]">ระบุจำนวน</p>
                <div className="pl-3">
                <InputNumber
                    value={value}
                    min={0}
                    max={selectProduct.stock}
                    onChange={(newValue) => setValue(newValue as number)}
                    addonBefore={<button onClick={handleDecrement}>-</button>}
                    addonAfter={<button onClick={handleIncrement}>+</button>}
                    readOnly
                />
                </div>
            </div>
            {value === selectProduct.stock && 
                <div className="mt-3 text-orange-600 text-center">
                    <p>จำนวนสินค้าหมดสต็อคแล้ว</p>
                </div>
            }
            {message && value < 1 ?
                <div className="mt-3 text-orange-600 text-center">
                    <p>{message}</p>
                </div>
                : null
            }
        </Modal>
    );
};

export default AddModalProduct;


