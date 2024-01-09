import { IoMdPrint } from "react-icons/io";
import { orderBills } from "@/types/fetchData";
import { getDate } from "@/utils/utils";
import { Collapse, CollapseProps } from "antd";
import React from "react"
import EmptyNodata from "./UI/EmptyNodata";

type Props = {
  orderBill: orderBills[];
}

const statusStr = (status: string): string => {
  switch (status) {
    case "process":
      return "รอรับออเดอร์";

    default:
      return "";
  }
}

const OrderBillDetail = ({ orderBill }: Props) => {

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
          <div>
          <button type="button" className="text-red-700 py-1 px-2 mr-1 border rounded-md text-sm drop-shadow-md hover:bg-red-600 hover:text-white hover:drop-shadow-xl whitespace-nowrap transition-transform transform hover:scale-105">
            <span className="flex items-center">
              <IoMdPrint className="mr-1" /> ยกเลิกออเดอร์
            </span>
          </button>
          <button type="button" className="text-gray-700 py-1 ml-1 px-2 border rounded-md text-sm drop-shadow-md hover:bg-gray-600 hover:text-white hover:drop-shadow-xl whitespace-nowrap transition-transform transform hover:scale-105">
            <span className="flex items-center">
              <IoMdPrint className="mr-1" /> รับออเดอร์
            </span>
          </button>
          </div>
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
        <p>แสดงออเดอร์ประจำวัน {getDate(new Date().toString())}</p>
      </div>
      <div>
        {items.length > 0 ?
          <Collapse className="mt-3" items={items} size="small" />
          :
          <EmptyNodata />
        }
      </div>
    </div>
  )
}

export default OrderBillDetail