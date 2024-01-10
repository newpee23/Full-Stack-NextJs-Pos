import { MdProductionQuantityLimits } from "react-icons/md";
import { RiBillLine } from "react-icons/ri";
import ModalCloseShowProduct from "./modal/ModalCloseShowProduct";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Badge } from "antd";
import { useDataHeadTitle } from "@/app/api/headTitle";
import { useDataProduct } from "@/app/api/product";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import { setLoadingOrderDetail } from "@/app/store/slices/loadingSlice";
import { setShowOrderBillMaking, setShowOrderBillProcess } from "@/app/store/slices/showSlice";
import { cleanOrderMakingCount, cleanOrderProcessCount, setOrderBillDetail } from "@/app/store/slices/refetchOrderBillSlice";

interface openModalType {
    modalCloseShowProduct: boolean;
}

const HeadTitle = () => {

    const { data: session } = useSession();
    const dispatch = useAppDispatch();
    const { showOrderBillMaking, showOrderBillProcess } = useAppSelector((state) => state?.showSlice);
    const { orderMakingCount, orderProcessCount } = useAppSelector((state) => state?.refetchOrderBillSlice);
    const { data: dataSailProduct, isLoading: isLoadingSailProduct, isError: isErrorSailProduct, refetch: refetchSailProduct, remove: removeSailProduct } = useDataProduct(session?.user.accessToken, session?.user.company_id);
    const { data: orderBillProcess, isLoading: isLoadingOrderBillProcess, isError: isErrorOrderBillProcess, refetch: refetchOrderBillProcess, remove: removeOrderBillProcess } = useDataHeadTitle(session?.user.accessToken, session?.user.branch_id, "process");
    const { data: orderBillMaking, isLoading: isLoadingOrderBillMaking, isError: isErrorOrderBillMaking, refetch: refetchOrderBillMaking, remove: removeOrderBillMaking } = useDataHeadTitle(session?.user.accessToken, session?.user.branch_id, "making");

    const [openModal, setOpenModal] = useState<openModalType>({
        modalCloseShowProduct: false,
    });

    const handleRefreshSailProduct = async () => {
        removeSailProduct();
        return await refetchSailProduct();
    };

    const handleRefreshProcess = async () => {
        removeOrderBillProcess();
        return await refetchOrderBillProcess();
    };

    const handleRefreshMaking = async () => {
        removeOrderBillMaking();
        return await refetchOrderBillMaking();
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

    useEffect(() => {
        const refreshMaking = () => {
            dispatch(cleanOrderMakingCount());
            if (orderBillMaking?.orderBillData) {
                dispatch(setOrderBillDetail(orderBillMaking.orderBillData));
            }
        }

        return refreshMaking();
    }, [orderBillMaking]);

    useEffect(() => {
        const refreshMaking = () => {
            dispatch(cleanOrderProcessCount());
            if (orderBillProcess?.orderBillData) {
                dispatch(setOrderBillDetail(orderBillProcess.orderBillData));
            }
        }

        return refreshMaking();
    }, [orderBillProcess]);

    useEffect(() => {
        dispatch(setLoadingOrderDetail(isLoadingOrderBillProcess));
    }, [isLoadingOrderBillProcess]);

    useEffect(() => {
        dispatch(setLoadingOrderDetail(isLoadingOrderBillMaking));
    }, [isLoadingOrderBillMaking]); 

  
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
                        <Badge size="default" count={orderMakingCount}>
                            {showOrderBillMaking ?
                                <button onClick={() => { dispatch(setShowOrderBillMaking(!showOrderBillMaking)) }} type="button" className="text-red-700 py-2 px-3 border rounded-md text-sm drop-shadow-md hover:bg-red-600 hover:text-white hover:drop-shadow-xl whitespace-nowrap transition-transform transform hover:scale-105">
                                    <span className="flex items-center">
                                        ปิดแสดงออเดอร์กำลังเตรียมประจำวัน
                                    </span>
                                </button>
                                :
                                <button onClick={() => { dispatch(setShowOrderBillMaking(!showOrderBillMaking)); dispatch(setShowOrderBillProcess(false)); handleRefreshMaking(); }} type="button" className="text-gray-700 py-2 px-3 border rounded-md text-sm drop-shadow-md hover:bg-gray-600 hover:text-white hover:drop-shadow-xl whitespace-nowrap transition-transform transform hover:scale-105">
                                    <span className="flex items-center">
                                        แสดงออเดอร์กำลังเตรียมประจำวัน
                                    </span>
                                </button>
                            }

                        </Badge>
                    </div>
                    <div className="ml-2">
                        <Badge size="default" count={orderProcessCount}>
                            {showOrderBillProcess ?
                                <button onClick={() => { dispatch(setShowOrderBillProcess(!showOrderBillProcess)); }} type="button" className="text-red-700 py-2 px-3 border rounded-md text-sm drop-shadow-md hover:bg-red-600 hover:text-white hover:drop-shadow-xl whitespace-nowrap transition-transform transform hover:scale-105">
                                    <span className="flex items-center">
                                        ปิดแสดงออเดอร์ประจำวัน
                                    </span>
                                </button>
                                :
                                <button onClick={() => { dispatch(setShowOrderBillProcess(!showOrderBillProcess)); dispatch(setShowOrderBillMaking(false)); handleRefreshProcess(); }} type="button" className="text-gray-700 py-2 px-3 border rounded-md text-sm drop-shadow-md hover:bg-gray-600 hover:text-white hover:drop-shadow-xl whitespace-nowrap transition-transform transform hover:scale-105">
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
