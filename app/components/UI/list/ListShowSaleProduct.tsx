import { useUpdateStatusSailProduct } from "@/app/api/product";
import { fetchProduct } from "@/types/fetchData";
import { Switch, message } from "antd";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { QueryObserverResult } from "react-query";

type Props = {
    data: fetchProduct[];
    handleRefresh: () => Promise<QueryObserverResult<fetchProduct[], unknown>>
}

const ListShowSaleProduct = ({ data, handleRefresh }: Props) => {

    const { data: session } = useSession();
    const [messageApi, contextHolder] = message.useMessage();
    const [loadingStates, setLoadingStates] = useState<boolean[]>(Array(data.length).fill(false));
    const updateDataStatusSailProduct = useUpdateStatusSailProduct();

    const showMessage = ({ status, text }: { status: string, text: string }) => {
        if (status === "success") { messageApi.success(text); }
        else if (status === "error") { messageApi.error(text); }
        else if (status === "warning") { messageApi.warning(text); }
    };

    const handleSwitchChange = async (checked: boolean, dataIndex: number, productId: number) => {
        const updatedLoadingStates = [...loadingStates];
        updatedLoadingStates[dataIndex] = true;
        setLoadingStates(updatedLoadingStates);

        const updateStatusSailById = await updateDataStatusSailProduct.mutateAsync({
            token: session?.user.accessToken,
            data: {
                productId: productId,
                sailStatus: checked
            }
        });

        if (!updateStatusSailById) {
            showMessage({ status: "error", text: "พบข้อผิดพลาดกรุณาลองใหม่อีกครั้ง" });
        }
        showMessage({ status: "success", text: "แก้ไขข้อมูลเรียบร้อย" })
        return setTimeout(() => {
            const resetLoadingStates = [...loadingStates];
            resetLoadingStates[dataIndex] = false;
            setLoadingStates(resetLoadingStates);
            handleRefresh();
        }, 1000);
    };

    return (
        <div className="grid p-5 gap-5 grid-cols-2 mdl:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 text-center">
            {data.map((item, index) => (
                <div key={index}>
                    <p>{item.name}</p>
                    <Switch
                        checkedChildren="แสดงสินค้า"
                        unCheckedChildren="ไม่แสดงสินค้า"
                        defaultChecked={item.statusSail === "Active"}
                        loading={loadingStates[index]}
                        onChange={(checked) => handleSwitchChange(checked, index, item.id)}
                    />
                </div>
            ))}
            {contextHolder}
        </div>
    );
}

export default ListShowSaleProduct;
