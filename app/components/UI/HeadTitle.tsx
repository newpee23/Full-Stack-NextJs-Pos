import { MdProductionQuantityLimits } from "react-icons/md";
import { RiBillLine } from "react-icons/ri";
import ModalCloseShowProduct from "./modal/ModalCloseShowProduct";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Badge } from "antd";
import { useDataHeadTitle } from "@/app/api/headTitle";
import { useDataProduct } from "@/app/api/product";
import { orderBills } from "@/types/fetchData";

interface openModalType {
    modalCloseShowProduct: boolean;
}

type Props = {
    showOrderBill: boolean;
    setShowOrderBill: (value: boolean) => void;
    setOrderBill: (value: orderBills[]) => void;
}

const HeadTitle = ({ setShowOrderBill, showOrderBill, setOrderBill }: Props) => {

    const { data: session } = useSession();
    const { data: dataSailProduct, isLoading: isLoadingSailProduct, isError: isErrorSailProduct, refetch: refetchSailProduct, remove: removeSailProduct } = useDataProduct(session?.user.accessToken, session?.user.company_id);
    const { data: dataOrderBill, isLoading: isLoadingOrderBill, isError: isErrorOrderBill, refetch: refetchOrderBill, remove: removeOrderBill } = useDataHeadTitle(session?.user.accessToken, session?.user.branch_id, "process");

    const [openModal, setOpenModal] = useState<openModalType>({
        modalCloseShowProduct: false,
    });

    const handleRefreshSailProduct = async () => {
        removeSailProduct();
        return await refetchSailProduct();
    };

    const handleButtonClick = () => {
        setOpenModal((prev) => ({ ...prev, modalCloseShowProduct: !prev.modalCloseShowProduct }));
    };

    useEffect(() => {
        const refreshSailShoeProduct = () => {
            if (openModal.modalCloseShowProduct) {
                handleRefreshSailProduct();
            }
        }

        return refreshSailShoeProduct();
    }, [openModal]);

    return (
        <div className={`p-4 w-full top-0 bg-white shadow-md rounded-lg`}>
            <div className="flex items-center drop-shadow-md justify-between">
                <div>
                    <button onClick={handleButtonClick} type="button" className="text-gray-700 py-2 px-3 border rounded-md text-sm drop-shadow-md hover:bg-gray-600 hover:text-white hover:drop-shadow-xl whitespace-nowrap transition-transform transform hover:scale-105">
                        <span className="flex items-center">
                            <MdProductionQuantityLimits className="mr-1" /> แสดงการขายสินค้ารายตัว
                        </span>
                    </button>
                    {openModal.modalCloseShowProduct && <ModalCloseShowProduct data={dataSailProduct} isLoading={isLoadingSailProduct} isError={isErrorSailProduct} modalCloseShowProduct={openModal.modalCloseShowProduct} setOpenModal={() => setOpenModal((prev) => ({ ...prev, modalCloseShowProduct: false }))} />}
                </div>
                <div className="flex">
                    <div className="mr-2">
                        <Badge size="default" count={5}>
                         
                                <button onClick={() => { setShowOrderBill(!showOrderBill); setOrderBill([]); }} type="button" className="text-gray-700 py-2 px-3 border rounded-md text-sm drop-shadow-md hover:bg-gray-600 hover:text-white hover:drop-shadow-xl whitespace-nowrap transition-transform transform hover:scale-105">
                                    <span className="flex items-center">
                                        แสดงออเดอร์กำลังเตรียมประจำวัน
                                    </span>
                                </button>
                        
                        </Badge>
                    </div>
                    <div className="ml-2">
                        <Badge size="default" count={dataOrderBill?.orderBillData?.length}>
                            {showOrderBill ?
                                <button onClick={() => { setShowOrderBill(!showOrderBill); setOrderBill([]); }} type="button" className="text-red-700 py-2 px-3 border rounded-md text-sm drop-shadow-md hover:bg-red-600 hover:text-white hover:drop-shadow-xl whitespace-nowrap transition-transform transform hover:scale-105">
                                    <span className="flex items-center">
                                        ปิดแสดงออเดอร์ประจำวัน
                                    </span>
                                </button>
                                :
                                <button onClick={() => { setShowOrderBill(!showOrderBill); setOrderBill(dataOrderBill?.orderBillData ? dataOrderBill.orderBillData : []); }} type="button" className="text-gray-700 py-2 px-3 border rounded-md text-sm drop-shadow-md hover:bg-gray-600 hover:text-white hover:drop-shadow-xl whitespace-nowrap transition-transform transform hover:scale-105">
                                    <span className="flex items-center">
                                        <RiBillLine className="mr-1" /> แสดงออเดอร์ประจำวัน
                                    </span>
                                </button>
                            }
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeadTitle;
