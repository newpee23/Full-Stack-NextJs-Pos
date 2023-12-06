import React, { useEffect, useState } from "react";
import { List, Form, message } from "antd";
import { optionSelectPromotionItem } from "@/types/fetchData";
import SpinDiv from "../loading/SpinDiv";
import InputFrom from "../InputFrom";
import StatusFrom from "../select/StatusFrom";
import SaveBtn from "../btn/SaveBtn";
import { promotionItem } from "../../ฺFrom/PromotionItemFrom";
import { useAddDataItemPromotion } from "@/app/api/promotionItem";
import { useAppDispatch } from "@/app/store/store";
import { setLoading } from "@/app/store/slices/loadingSlice";
import { useSession } from "next-auth/react";
import { dataVerifyItemPromotion } from "@/types/verify";
import ProgressBar from "../loading/ProgressBar";
import ErrFrom from "../../ErrFrom";
import { MdDelete } from "react-icons/md";

interface ListPromotionItemProps {
    itemPromoTion: optionSelectPromotionItem[];
    handleRemoveProduct: (productIdToRemove: number) => void;
}

interface FormValues {
    [key: string]: promotionItem;
}

const conversDataToArray = (values: { [key: string]: FormValues }): dataVerifyItemPromotion[] => {
    const dataArray: dataVerifyItemPromotion[] = Object.keys(values).filter(key => key.includes('stock')).map(stockKey => {
        const index = stockKey.split('-')[1];
        const stock = Number(values[stockKey]); // Convert to number
        const promotionId = Number(values[`promotionId-${index}`]); // Convert to number
        const productId = Number(values[`productId-${index}`]); // Convert to number
        const statusCandidate = values[`status-${index}`];

        // Ensure statusCandidate is a string (or adjust based on your actual type)
        const status: "Active" | "InActive" = typeof statusCandidate === 'string' ? statusCandidate : "InActive";

        return { promotionId, productId, stock, status, };
    });

    return dataArray;
};

const ListPromotionItem: React.FC<ListPromotionItemProps> = ({ itemPromoTion, handleRemoveProduct }) => {

    const dispatch = useAppDispatch();
    const [form] = Form.useForm();
    const { data: session } = useSession();
    const [messageApi, contextHolder] = message.useMessage();
    const [spinning, setSpinning] = useState<boolean>(false);
    const addDataItemPromotionMutation = useAddDataItemPromotion();
    const [messageError, setMessageError] = useState<{ message: string }[]>([]);
    const [loadingQuery, setLoadingQuery] = useState<number>(0);

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

    useEffect(() => {
        const loadComponents = () => {
            if (loadingQuery > 0) {
                dispatch(setLoading({ loadingAction: loadingQuery, showLoading: true }));
            }
        };

        loadComponents();
    }, [loadingQuery]);

    const showMessage = ({ status, text }: { status: string; text: string }) => {
        if (status === 'success') {
            messageApi.success(text);
        } else if (status === 'error') {
            messageApi.error(text);
        } else if (status === 'warning') {
            messageApi.warning(text);
        }
    };

    const handleSubmit = async (values: { [key: string]: FormValues }) => {
        try {
            // สร้าง array จากข้อมูลใน form
            const resultArray = conversDataToArray(values);
            setLoadingQuery(0);
            dispatch(setLoading({ loadingAction: 0, showLoading: true }));

            // Insert itemPromotion
            const itemPromotion = await addDataItemPromotionMutation.mutateAsync({
                token: session?.user.accessToken,
                itemPromotionData: resultArray,
                setLoadingQuery: setLoadingQuery
            });

            if (itemPromotion === null) return showMessage({ status: "error", text: "เพิ่มข้อมูลสินค้าในโปรโมชั่นไม่สำเร็จ กรุณาลองอีกครั้ง" });
            if (itemPromotion?.status === true) {
                // setTimeout(() => { onClick(); }, 1500);
                return showMessage({ status: "success", text: "เพิ่มข้อมูลสินค้าในโปรโมชั่นสำเร็จ" });
            }
            if (typeof itemPromotion.message !== 'string') setMessageError(itemPromotion.message);
            return showMessage({ status: "error", text: "เพิ่มข้อมูลสินค้าในโปรโมชั่นไม่สำเร็จ กรุณาแก้ไขข้อผิดพลาด" });
        } catch (error: unknown) {
            console.error('Failed to add data:', error);
        }
    };

    return (
        <div className="mt-5">
            {contextHolder}
            <div className="mb-5 ml-5">
                <p className="text-base">
                    <u>ข้อมูลสินค้าในโปรโมชั่น</u>{itemPromoTion.length > 0 && (<> : <span className="text-orange-2">(<u>{itemPromoTion[0].promotionName}</u>)</span></>)}
                </p>
            </div>
            <SpinDiv spinning={spinning}>
                <Form form={form} onFinish={handleSubmit}>
                    <List itemLayout="vertical" size="large" pagination={{ pageSize: 12 }} dataSource={itemPromoTion} renderItem={(item, index) => (
                        <List.Item key={index}>
                            <div className="flex items-center justify-between flex-col mt-[-10px]">
                                {/* ชื่อสินค้า */}
                                <div className="flex w-full">
                                    <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{index+1}).{item.label}</p>
                                </div>
                                <div className="flex w-full justify-end items-center mt-2">
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
                                        <MdDelete  className="mx-2 ml-5 mt-1 text-red-700 cursor-pointer" style={{ fontSize: "24px" }} onClick={() => handleRemoveProduct(item.value)} />
                                    </div>
                                </div>
                            </div>
                        </List.Item>
                    )}
                    />
                    {itemPromoTion.length > 0 && (
                        <div>
                            <ProgressBar />
                            <Form.Item>
                                <SaveBtn label="บันทึกข้อมูล" />
                            </Form.Item>
                        </div>
                    )}
                </Form>
            </SpinDiv>
            {messageError.length > 0 && <ErrFrom showError={messageError}/>}
        </div>
    );
};

export default ListPromotionItem;
