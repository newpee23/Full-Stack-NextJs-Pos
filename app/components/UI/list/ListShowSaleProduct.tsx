import { useUpdateStatusSailProduct } from "@/app/api/product";
import { fetchProduct } from "@/types/fetchData";
import { Pagination, Switch, message } from "antd";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

type Props = {
    data: fetchProduct[];
}

interface paginationStateType {
    current: number;
    pageSize: number;
}

const ListShowSaleProduct = ({ data }: Props) => {
    const { data: session } = useSession();
    const [messageApi, contextHolder] = message.useMessage();
    const [loadingStates, setLoadingStates] = useState<boolean[]>([]);
    const updateDataStatusSailProduct = useUpdateStatusSailProduct();

    // Pagination state
    const [paginationState, setPaginationState] = useState<paginationStateType>({
        current: 1,
        pageSize: 15
    });
    const currentData = data.slice((paginationState.current - 1) * paginationState.pageSize, paginationState.current * paginationState.pageSize);

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
        }, 1000);
    };

    const showMessage = ({ status, text }: { status: string, text: string }) => {
        if (status === "success") { messageApi.success(text); }
        else if (status === "error") { messageApi.error(text); }
        else if (status === "warning") { messageApi.warning(text); }
    };

    return (
        <>
            <div className="grid p-5 gap-5 grid-cols-2 mdl:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 text-center">
                {currentData.map((item, index) => (
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
            </div>
            {contextHolder}
            <div className="text-center">
                <Pagination
                    current={paginationState.current}
                    pageSize={paginationState.pageSize}
                    total={data.length}
                    onChange={(pageNumber) => setPaginationState((prev) => ({ ...prev, current: pageNumber }))}
                />
            </div>
        </>
    );
};

export default ListShowSaleProduct;
