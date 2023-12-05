import React, { useEffect, useState } from "react";
import { List, Form } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { optionSelectPromotionItem } from "@/types/fetchData";
import SpinDiv from "../loading/SpinDiv";
import InputFrom from "../InputFrom";
import StatusFrom from "../select/StatusFrom";
import SaveBtn from "../btn/SaveBtn";

interface ListPromotionItemProps {
    productId: optionSelectPromotionItem[];
    handleRemoveProduct: (productIdToRemove: number) => void;
}

interface FormValues {
    [key: string]: {
        stock: number;
        status: "Active" | "InActive";
    }
}

interface arraySubmit {
    stock: FormValues;
    status: FormValues;
}

const ListPromotionItem: React.FC<ListPromotionItemProps> = ({ productId, handleRemoveProduct }) => {
    const [form] = Form.useForm();
    const [spinning, setSpinning] = useState<boolean>(false);

    useEffect(() => {
        const setData = () => {
            // ตั้งค่าเริ่มต้นของฟอร์มที่นี่
            if (productId.length > 0) {
                setSpinning(true);
                const initialValues: { [key: string]: string | number } = {};
                productId.forEach((item, index) => {
                    initialValues[`stock-${index}`] = item.stock;
                    initialValues[`status-${index}`] = "Active";
                });
                form.setFieldsValue(initialValues);
                setTimeout(() => { setSpinning(false) }, 500);
            }
        }

        return () => setData();
    }, [productId, form]);

    const onFinish = (values: { [key: string]: FormValues }) => {
        // สร้าง array จากข้อมูลใน form
        const dataArray: arraySubmit[] = Object.keys(values).filter(key => key.includes('stock')).map(stockKey => {
            const index = stockKey.split('-')[1]; // ดึง index จาก key
            const stock = values[stockKey];
            const status = values[`status-${index}`];
            return { stock, status };
        });

        console.log(dataArray);
    };

    return (
        <div className="mt-5">
            <div className="mb-5">
                <p className="text-base">
                    <u>ข้อมูลสินค้าในโปรโมชั่น</u>
                </p>
            </div>
            <SpinDiv spinning={spinning}>
                <Form form={form} onFinish={onFinish}>
                    <List itemLayout="vertical" size="large" pagination={{ pageSize: 12 }} dataSource={productId} renderItem={(item, index) => (
                        <List.Item key={index}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="w-[270px] overflow-hidden text-ellipsis whitespace-nowrap">{item.label}</p>
                                </div>
                                <div className="flex items-center">
                                    <div className="ml-3">
                                        <InputFrom label="จำนวน" name={`stock-${index}`} required={true} type="number" />
                                    </div>
                                    <div className="ml-3 flex">
                                        <StatusFrom label="สถานะ" name={`status-${index}`} />
                                        <CloseCircleOutlined className="mx-2 text-red-700" style={{ fontSize: "24px" }} onClick={() => handleRemoveProduct(item.value)} />
                                    </div>
                                </div>
                            </div>
                        </List.Item>
                    )}
                    />
                    {productId.length > 0 && (
                        <Form.Item>
                            <SaveBtn label="บันทึกข้อมูล" />
                        </Form.Item>
                    )}
                </Form>
            </SpinDiv>
        </div>
    );
};

export default ListPromotionItem;
