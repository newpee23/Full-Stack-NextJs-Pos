"use client"
import { useDataFront } from "@/app/api/customerFront/getProduct";
import ErrPage from "@/app/components/ErrPage";
import MenuFront from "@/app/components/MenuFront";
import Navbar from "@/app/components/Navbar";
import CountdownTime from "@/app/components/UI/CountdownTime";
import FloatBtn from "@/app/components/UI/btn/FloatBtn";
import CardProduct from "@/app/components/UI/card/CardProduct";
import CardPromotion from "@/app/components/UI/card/CardPromotion";
import SkeletonTable from "@/app/components/UI/loading/SkeletonTable";
import "@/app/customerFront/order.css"
import "@/app/components/menuPage.css";
import { setTransactionId } from "@/app/store/slices/cartSlice";
import { useAppDispatch } from "@/app/store/store";
import { getDate, getTime7H } from "@/utils/utils";
import { Result } from "antd";
import React, { useEffect, useState } from "react";

interface HomePageFrontProps {
  params: {
    tokenOrder: string;
  };
}

const HomePageFront = ({ params }: HomePageFrontProps) => {
  const { tokenOrder } = params;
  const dispatch = useAppDispatch();
  const { data, isLoading, isError, refetch, remove } = useDataFront(tokenOrder);
  const [beOver, setBeOver] = useState(false);

  useEffect(() => {
    if (data) {
      dispatch(setTransactionId(data.id));
    }

  }, [data]);

  if (!tokenOrder) {
    return <ErrPage />;
  }

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

  if (!data) {
    return <ErrPage onClick={handleRefresh} />;
  }

  return (
    <section>
      <Navbar orderDetail={data} />
      <div className="mt-14 flex">
        <MenuFront productType={data.productData} />
        <div className="w-full p-3">
          <div className="mt-3 text-center">
            <p className="text-lg">{data.tablesData.name} ({data.peoples} ท่าน)</p>
            <p>วันที่ใช้บริการ {getDate(data.startOrder.toString())}</p>
            <p>เวลาเริ่มต้น {getTime7H(data.startOrder.toString())} เวลาสิ้นสุด {getTime7H(data.endOrder.toString())}</p>
            <CountdownTime time={data.tablesData.expiration} startOrder={data.startOrder} setBeOver={setBeOver} />
            <p className="text-orange-600 text-xs">*เมื่อถึงเวลาสิ้นสุดจะไม่สามารถสั่งรายการอาหารได้</p>
          </div>
          {!beOver ?
            <div className="mt-5 mb-10">
              {data.promotionData.length > 0 && <CardPromotion promotionData={data.promotionData} />}
              <CardProduct productData={data.productData} />
            </div> :
            <div className="text-center m-3">
              <Result status="error" className="pb-3" title="เวลาการใช้บริการของท่านหมดแล้ว" subTitle="กรุณาติดต่อพนักงานเพื่อชำระเงิน" />
            </div>
          }
        </div>
      </div>
      <FloatBtn />
    </section>
  );
};

export default HomePageFront;
