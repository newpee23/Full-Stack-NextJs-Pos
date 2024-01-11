import { MdCoffeeMaker, MdProductionQuantityLimits } from "react-icons/md";
import ModalCloseShowProduct from "./modal/ModalCloseShowProduct";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Badge } from "antd";
import { useDataProduct } from "@/app/api/product";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import { setLoadingOrderDetail } from "@/app/store/slices/loadingSlice";
import { setShowOrderBillMaking, setShowOrderBillProcess } from "@/app/store/slices/showSlice";
import { cleanOrderMakingCount, cleanOrderProcessCount, plusOrderProcessCount, setOrderBillDetail, setRefetchDataOrder, setRefetchDataOrderMaking } from "@/app/store/slices/refetchOrderBillSlice";
import { useDataMakingHeadTitle, useDataProcessHeadTitle } from "@/app/api/headTitle";
import { FaMoneyBillWheat } from "react-icons/fa6";

interface openModalType {
    modalCloseShowProduct: boolean;
}

const HeadTitle = () => {

    const { data: session } = useSession();
    const dispatch = useAppDispatch();
    const { showOrderBillMaking, showOrderBillProcess } = useAppSelector((state) => state?.showSlice);
    const { orderMakingCount, orderProcessCount, refetchDataOrder, refetchDataOrderMaking } = useAppSelector((state) => state?.refetchOrderBillSlice);
    const { data: dataSailProduct, isLoading: isLoadingSailProduct, isError: isErrorSailProduct, refetch: refetchSailProduct, remove: removeSailProduct } = useDataProduct(session?.user.accessToken, session?.user.company_id);
    const { data: orderBillProcess, isLoading: isLoadingOrderBillProcess, isError: isErrorOrderBillProcess, refetch: refetchOrderBillProcess, remove: removeOrderBillProcess } = useDataProcessHeadTitle(session?.user.accessToken, session?.user.branch_id, "process");
    const { data: orderBillMaking, isLoading: isLoadingOrderBillMaking, isError: isErrorOrderBillMaking, refetch: refetchOrderBillMaking, remove: removeOrderBillMaking } = useDataMakingHeadTitle(session?.user.accessToken, session?.user.branch_id, "making");

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
        const refreshOrderProcess = () => {
            if (refetchDataOrder) {
                dispatch(setRefetchDataOrder(!refetchDataOrder));
                handleRefreshProcess();
            }
        }

        return refreshOrderProcess();
    }, [refetchDataOrder]);

    useEffect(() => {
        const refreshOrderMaking = () => {

            if (refetchDataOrderMaking) {
                dispatch(setRefetchDataOrderMaking(!refetchDataOrderMaking));
                handleRefreshMaking();
            }
        }

        return refreshOrderMaking();
    }, [refetchDataOrderMaking]);

    useEffect(() => {
        const refreshMaking = () => {
            if (showOrderBillMaking) {
                dispatch(cleanOrderMakingCount());
                handleRefreshMaking();
            }
        }

        return refreshMaking();
    }, [showOrderBillMaking]);

    useEffect(() => {
        const refreshMaking = () => {
            if (orderBillMaking?.orderBillData) {
                dispatch(setOrderBillDetail(orderBillMaking.orderBillData));
            }
        }

        return refreshMaking();
    }, [orderBillMaking]);

    useEffect(() => {
        const refreshProcess = () => {
            if (showOrderBillProcess) {
                dispatch(cleanOrderProcessCount());
                handleRefreshProcess();
            }
        }

        return refreshProcess();
    }, [showOrderBillProcess]);

    useEffect(() => {
        const refreshProcess = () => {
            if (orderBillProcess?.orderBillData) {
                dispatch(plusOrderProcessCount(orderBillProcess.orderBillData.length));
                dispatch(setOrderBillDetail(orderBillProcess.orderBillData));
            }
        }

        return refreshProcess();
    }, [orderBillProcess]);

    useEffect(() => {
        dispatch(setLoadingOrderDetail(isLoadingOrderBillProcess));
    }, [isLoadingOrderBillProcess]);

    useEffect(() => {
        dispatch(setLoadingOrderDetail(isLoadingOrderBillMaking));
    }, [isLoadingOrderBillMaking]);


    return (
        <div className={`p-4 w-full top-0 bg-white shadow-md rounded-lg`}>
            <div className="flex items-center drop-shadow-md flex-col justify-center mdl:flex-row mdl:justify-between">
                <div>
                    <button onClick={handleButtonClick} type="button" className="text-gray-700 py-2 px-3 border rounded-md text-sm drop-shadow-md hover:bg-gray-600 hover:text-white hover:drop-shadow-xl whitespace-nowrap transition-transform transform hover:scale-105">
                        <span className="flex items-center">
                            <MdProductionQuantityLimits className="mr-1" /> แสดงการขายสินค้ารายตัว
                        </span>
                    </button>
                    {openModal.modalCloseShowProduct && <ModalCloseShowProduct data={dataSailProduct} isLoading={isLoadingSailProduct} isError={isErrorSailProduct} modalCloseShowProduct={openModal.modalCloseShowProduct} setOpenModal={() => setOpenModal((prev) => ({ ...prev, modalCloseShowProduct: false }))} />}
                </div>
                <div className="flex flex-col justify-center lgl:flex-row">
                    <div className="text-center mx-2 my-2  lgl:my-0">
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
                                        <MdCoffeeMaker className="mr-1"/> แสดงออเดอร์กำลังเตรียมประจำวัน
                                    </span>
                                </button>
                            }

                        </Badge>
                    </div>
                    <div className="text-center mdl:text-right mdl:mr-2 lgl:mr-0">
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
                                        <FaMoneyBillWheat className="mr-1"/> แสดงออเดอร์ประจำวัน
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
