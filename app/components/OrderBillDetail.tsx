import { IoMdPrint } from "react-icons/io";
import { orderBills } from "@/types/fetchData";
import { getDate } from "@/utils/utils";
import { Collapse, CollapseProps, Spin, message } from "antd";
import React, { useState } from "react"
import EmptyNodata from "./UI/EmptyNodata";
import SkeletonTable from "./UI/loading/SkeletonTable";
import { useAppDispatch, useAppSelector } from "../store/store";
import { plusOrderMakingCount, setRefetchDataOrder, setRefetchDataOrderMaking } from "../store/slices/refetchOrderBillSlice";
import RefreshBtn from "./UI/btn/RefreshBtn";
import { FaShippingFast } from "react-icons/fa";
import { useUpdateOrderBillStatus } from "../api/orderBill";
import { useSession } from "next-auth/react";
import CancelBtnBill from "./UI/btn/CancelBtnBill";

type Props = {
  title: string;
}

const statusStr = (status: string): string => {
  switch (status) {
    case "process":
      return "รอรับออเดอร์";
    case "making":
      return "กำลังจัดเตรียม";
    default:
      return "";
  }
}

const OrderBillDetail = ({ title }: Props) => {

  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const { loadingOrderDetail } = useAppSelector((state) => state?.loadingSlice);
  const { orderBill, refetchDataOrder, refetchDataOrderMaking } = useAppSelector((state) => state?.refetchOrderBillSlice);
  const [messageApi, contextHolder] = message.useMessage();
  const updateDataOrderBillStatus = useUpdateOrderBillStatus();

  const handleTakingOrders = (value: orderBills) => {
    console.log(value);
    dispatch(plusOrderMakingCount());
  }

  const showMessage = ({ status, text }: { status: string, text: string }) => {
    if (status === "success") { messageApi.success(text); }
    else if (status === "error") { messageApi.error(text); }
    else if (status === "warning") { messageApi.warning(text); }
  };

  const handleActionOrders = async (orderId: number, status: "process" | "succeed" | "cancel" | "making") => {
    try {
      setLoading(true);
      let str = "";

      if(status === "succeed"){
        str = "เสิร์ฟออเดอร์";
      }
      if(status === "cancel"){
        str = "ยกเลิกออเดอร์";
      }

      const updateOrderBill = await updateDataOrderBillStatus.mutateAsync({
        token: session?.user.accessToken,
        data: {
          orderId: orderId,
          status: status
        }
      });

      if (updateOrderBill === null) return showMessage({ status: "error", text: `${str}ไม่สำเร็จ กรุณาแก้ไขข้อผิดพลาด` });
      if (updateOrderBill?.status === true) {
        setTimeout(() => { 
          handleRefetchData(); 
        }, 500);
        return showMessage({ status: "success", text: `${str}สำเร็จ` });
      }

    } catch (error) {
      console.error('Failed to handleServeOrders:', error);
      return showMessage({ status: "error", text: "เสิร์ฟออเดอร์ไม่สำเร็จ กรุณาแก้ไขข้อผิดพลาด" });
    } finally {
      setLoading(false);
    }
  }

  const handleRefetchData = () => {
    if (title === "แสดงออเดอร์ประจำวัน") {
      dispatch(setRefetchDataOrder(!refetchDataOrder))
    } else {
      dispatch(setRefetchDataOrderMaking(!refetchDataOrderMaking))
    }
  }


  const btnActionJsx = (val: orderBills, index: number): React.JSX.Element => {
    if (title === "แสดงออเดอร์ประจำวัน") {
      return (
        <div>
          <CancelBtnBill name={`รายการการสั่งอาหารออเดอร์ที่ : ${(index + 1)}`} onClick={() => handleActionOrders(val.id, "cancel")} />
          <button type="button" onClick={() => handleTakingOrders(val)} className="text-gray-700 py-1 ml-1 px-2 border rounded-md text-sm drop-shadow-md hover:bg-gray-600 hover:text-white hover:drop-shadow-xl whitespace-nowrap transition-transform transform hover:scale-105">
            <span className="flex items-center">
              <IoMdPrint className="mr-1" /> รับออเดอร์
            </span>
          </button>
        </div>);
    }

    return (
      <button type="button" onClick={() => handleActionOrders(val.id, "succeed")} className="text-gray-700 py-1 ml-1 px-2 border rounded-md text-sm drop-shadow-md hover:bg-gray-600 hover:text-white hover:drop-shadow-xl whitespace-nowrap transition-transform transform hover:scale-105">
        <span className="flex items-center">
          <FaShippingFast className="mr-1" /> เสิร์ฟออเดอร์
        </span>
      </button>
    );
  }

  const items: CollapseProps["items"] = orderBill.map((orderBillData, index) => ({
    key: index,
    label: (
      <div className="flex justify-between">
        <p>
          รายการการสั่งอาหารออเดอร์ที่ : {index + 1}{" "}
          <span className="text-orange-600">({orderBillData.tableName})</span>
        </p>
        <p>
          สถานะ :{" "}
          <span className="text-orange-600">
            ({statusStr(orderBillData.status)})
          </span>
        </p>
      </div>
    ),
    children: (
      <div>
        <div className="flex items-end justify-between">
          <p>รายละเอียด</p>
          {btnActionJsx(orderBillData, index)}
        </div>
        {orderBillData.ItemTransactions.map((detail, i) => (
          <div key={i}>
            <div className="text-sm text-orange-600">
              <p>
                {i + 1}. {detail?.productName ? detail.productName : detail.promotionName}
              </p>
            </div>
            <div className="flex justify-between text-xs ml-3 mb-1">
              <p>
                จำนวน : {detail.qty} * {detail.price} {detail.unitName}
              </p>
              <p>{detail.qty * detail.price}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  }));

  return (
    <div className="p-3">
      <div className=" text-orange-600 text-center">
        <p>{title} {getDate(new Date().toString())}</p>
      </div>
      <Spin tip="Loading..." spinning={loading}>
        <div>
          {loadingOrderDetail ? <SkeletonTable /> :
            items.length > 0 ?
              <div className="mt-3">

                <div className="w-full flex justify-end mb-[-13px]">
                  <RefreshBtn label="Refresh Data" onClick={() => handleRefetchData()} />
                </div>

                <Collapse className="mt-3" items={items} size="small" />
              </div>
              :
              <EmptyNodata />
          }
          {contextHolder}
        </div>
      </Spin>
    </div>
  )
}

export default OrderBillDetail