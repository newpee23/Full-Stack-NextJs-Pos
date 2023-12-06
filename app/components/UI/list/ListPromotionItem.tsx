import React, { useEffect, useState } from "react";
import { List, Form } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { optionSelectPromotionItem } from "@/types/fetchData";
import SpinDiv from "../loading/SpinDiv";
import InputFrom from "../InputFrom";
import StatusFrom from "../select/StatusFrom";
import SaveBtn from "../btn/SaveBtn";
import { promotionItem } from "../../ฺFrom/PromotionItemFrom";

interface ListPromotionItemProps {
    itemPromoTion: optionSelectPromotionItem[];
    handleRemoveProduct: (productIdToRemove: number) => void;
}

interface FormValues {
    [key: string]: promotionItem;
}

interface itemPromotionSubmit {
    promotionId: FormValues;
    productId: FormValues;
    stock: FormValues;
    status: FormValues;
}

const ListPromotionItem: React.FC<ListPromotionItemProps> = ({ itemPromoTion, handleRemoveProduct }) => {
    const [form] = Form.useForm();
    const [spinning, setSpinning] = useState<boolean>(false);

    useEffect(() => {
        const setData = () => {
            // ตั้งค่าเริ่มต้นของฟอร์มที่นี่
            if (itemPromoTion.length > 0) {
                setSpinning(true);
                const initialValues: { [key: string]: string | number } = {};
                itemPromoTion.forEach((item, index) => {
                    initialValues[`promotionId-${index}`] = item.promotionId;
                    initialValues[`productId-${index}`] = item.productId;
                    initialValues[`stock-${index}`] = item.stock;
                    initialValues[`status-${index}`] = "Active";
                });
                form.setFieldsValue(initialValues);
                setTimeout(() => { setSpinning(false) }, 500);
            }
        }

        return () => setData();
    }, [itemPromoTion, form]);

    const onFinish = (values: { [key: string]: FormValues }) => {
        // สร้าง array จากข้อมูลใน form
        const dataArray: itemPromotionSubmit[] = Object.keys(values).filter(key => key.includes('stock')).map(stockKey => {
            const index = stockKey.split('-')[1]; // ดึง index จาก key
            const stock = values[stockKey];
            const promotionId = values[`promotionId-${index}`];
            const productId = values[`productId-${index}`];
            const status = values[`status-${index}`];
            return { promotionId, productId, stock, status };
        });

        console.log(dataArray);
    };

    return (
        <div className="mt-5">
            <div className="mb-5">
                <p className="text-base">
                    <u>ข้อมูลสินค้าในโปรโมชั่น</u>{itemPromoTion.length > 0 && (<> : <span className="text-orange-2">(<u>{itemPromoTion[0].promotionName}</u>)</span></>)}
                </p>
            </div>
            <SpinDiv spinning={spinning}>
                <Form form={form} onFinish={onFinish}>
                    <List itemLayout="vertical" size="large" pagination={{ pageSize: 12 }} dataSource={itemPromoTion} renderItem={(item, index) => (
                        <List.Item key={index}>
                            <div className="flex items-center justify-between">
                                {/* ชื่อสินค้า */}
                                <div>
                                    <p className="w-[270px] overflow-hidden text-ellipsis whitespace-nowrap">{item.label}</p>
                                </div>
                                <div className="flex items-center">
                                    <div className="ml-3">
                                        {/* id */}
                                        <InputFrom label="สินค้า" name={`productId-${index}`} required={true} type="hidden" />
                                        <InputFrom label="หัวข้อโปรโมชั่น" name={`promotionId-${index}`} required={true} type="hidden" />
                                        {/* จำนวน */}
                                        <InputFrom label="จำนวน" name={`stock-${index}`} required={true} type="number" />
                                    </div>
                                    {/* สถานะ */}
                                    <div className="ml-3 flex items-start">
                                        <StatusFrom label="สถานะ" name={`status-${index}`} />
                                        <CloseCircleOutlined className="mx-2 mt-1 text-red-700" style={{ fontSize: "24px" }} onClick={() => handleRemoveProduct(item.value)} />
                                    </div>
                                </div>
                            </div>
                        </List.Item>
                    )}
                    />
                    {itemPromoTion.length > 0 && (
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
