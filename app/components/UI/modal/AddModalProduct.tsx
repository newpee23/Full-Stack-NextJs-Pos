import React, { useEffect, useState } from 'react';
import { InputNumber, Modal } from 'antd';
import { productData } from '@/types/fetchData';

interface Props {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectProduct: productData | undefined;
}

const AddModalProduct: React.FC<Props> = ({ open, setOpen, selectProduct }) => {

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

    const [value, setValue] = useState<number>(0);

    useEffect(() => {
        if (open) {
            setValue(0);
        }
    }, [open]);

    const handleIncrement = () => {
        if (value < selectProduct.stock) {
            setValue(value + 1);
        }
    };

    const handleDecrement = () => {
        if (value > 0) {
            setValue(value - 1);
        }
    };

    const handleOk = () => {
        console.log("value",{id: selectProduct.id , value: value})
        setOpen(false);
    }

    return (
        <Modal
            title={selectProduct.name}
            open={open}
            onOk={handleOk}
            onCancel={() => setOpen(false)}
            okText="ตกลง"
            cancelText="ยกเลิก"
        >
            <div className="flex items-center justify-between">
                <p className="w-[60px]">ระบุจำนวน</p>
                <div className="pl-3">
                <InputNumber
                    value={value}
                    min={0}
                    max={selectProduct.stock}
                    formatter={(value) => `${value}`}
                    parser={(displayValue) => (displayValue ? parseInt(displayValue, 10) : 0)} // Ensure it returns a number
                    onChange={(newValue) => setValue(newValue as number)}
                    addonBefore={<button onClick={handleDecrement}>-</button>}
                    addonAfter={<button onClick={handleIncrement}>+</button>}
                    readOnly
                />
                </div>
            </div>
            {value === selectProduct.stock && <p className="mt-3 text-orange-600">จำนวนสินค้าหมดสต็อคแล้ว</p>}
        </Modal>
    );
};

export default AddModalProduct;
