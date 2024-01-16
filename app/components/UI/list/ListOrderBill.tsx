import { useDataOrderBill } from "@/app/api/customerFront/getOrderBill";
import { useAppSelector } from "@/app/store/store";
import { Collapse, CollapseProps } from "antd";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react"
import SkeletonTable from "../loading/SkeletonTable";
import ErrPage from "../../ErrPage";
import { btnActionType } from "../modal/ModalOrderHistory";
import TimeLineHistoryBill from "../TimeLineHistoryBill";
import CancelBtnBill from "../btn/CancelBtnBill";



interface prop {
    btnAction: btnActionType;
    setBtnAction: React.Dispatch<React.SetStateAction<btnActionType>>
}

const ListOrderBill = ({ btnAction, setBtnAction }: prop) => {

    const { data: session } = useSession();
    const { transactionId } = useAppSelector((state) => state?.cartSlice);

    const { data, isLoading, isError, refetch, remove } = useDataOrderBill(session?.user.accessToken, transactionId);

    useEffect(() => {
        if (btnAction.btnOrderHistory && btnAction.btnTotalPrice) {
            handleRefresh();
        }
    }, [btnAction]);

    const handleRefresh = async () => {
        remove();
        return await refetch();
    };

    if (isLoading) {
        return <SkeletonTable />;
    }

    if (isError) {
        return <ErrPage onClick={handleRefresh} />;
    }

    const items: CollapseProps["items"] = data?.orderBillData.map((item, index) => ({
        key: index,
        label: <div className="flex justify-between"><p>ประวัติการสั่งอาหารบิลที่ {item.index}</p><p className="text-orange-600">({item.status !== "cancel" ? item.totalBill : 0 }) บาท</p></div>,
        children: (
            <div>

                {item.ItemTransactions.map((detail, i) => (
                    <div key={i}>
                        {i === 0 && <TimeLineHistoryBill status={item.status}/>}
                        <div className="text-sm text-orange-600">
                            <p>{i + 1}. {detail?.productName ? detail.productName : detail.promotionName}</p>
                        </div>
                        <div className="flex justify-between text-xs ml-3 mb-1">
                            <p>จำนวน : {detail.qty} * {detail.price} {detail.unitName}</p>
                            <p> {(detail.qty * detail.price)}</p>
                        </div>
                    </div>
                ))}

            </div>
        ),
    }));

    return (
        <>
            <div className="flex justify-between items-end">
                {
                    !btnAction.btnTotalPrice ?
                        <button onClick={() => setBtnAction({ btnOrderHistory: !btnAction.btnOrderHistory, btnTotalPrice: !btnAction.btnTotalPrice })} type="button" className="text-orange-600 py-1 px-2 border rounded-md text-sm drop-shadow-md hover:bg-orange-700 hover:text-white hover:drop-shadow-xl whitespace-nowrap transition-transform transform hover:scale-105">
                            <span className="ml-1">เช็คยอดบิล</span>
                        </button> :
                        <button onClick={() => setBtnAction({ btnOrderHistory: !btnAction.btnOrderHistory, btnTotalPrice: !btnAction.btnTotalPrice })} type="button" className="text-orange-600 py-1 px-2 border rounded-md text-sm drop-shadow-md hover:bg-orange-700 hover:text-white hover:drop-shadow-xl whitespace-nowrap transition-transform transform hover:scale-105">
                            <span className="ml-1">ปิด</span>
                        </button>
                }
                {btnAction.btnTotalPrice && <p>ยอดสุทธิ : {data?.orderTotalBill} บาท</p>}
            </div>
            <div className="mt-3">
                {btnAction.btnOrderHistory && <Collapse className="mt-3" items={items} size="small" />}
            </div>
        </>
    )
}

export default ListOrderBill