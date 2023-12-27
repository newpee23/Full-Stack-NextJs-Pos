"use client"
import { useDataFront } from "@/app/api/customerFront/getProduct";
import ErrPage from "@/app/components/ErrPage";
import MenuFront from "@/app/components/MenuFront";
import Navbar from "@/app/components/Navbar";
import CountdownTime from "@/app/components/UI/CountdownTime";
import CardProduct from "@/app/components/UI/card/CardProduct";
import SkeletonTable from "@/app/components/UI/loading/SkeletonTable";
import "@/app/customerFront/order.css"
import React from "react";

interface HomePageFrontProps {
  params: {
    tokenOrder: string;
  };
}

const HomePageFront = ({ params }: HomePageFrontProps) => {
  const { tokenOrder } = params;
  
  const { data, isLoading, isError, refetch, remove } = useDataFront(tokenOrder);

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
      <Navbar page="customerFront" />
      <div className="mt-14 flex">
        <MenuFront productType={data.productData} />
        <div className="w-full p-3">
          <div className="mt-3 text-center">
            <p className="text-lg">{data.tablesData.name} ({data.peoples} ท่าน)</p>
            <p>วันที่ใช้บริการ 12/12/2023</p>
            <p>เวลาเริ่มต้น 20:00 เวลาสิ้นสุด 22:00</p>
            <CountdownTime time={data.tablesData.expiration} startOrder={data.startOrder} />
            <p className="text-orange-600 text-xs">*เมื่อถึงเวลาสิ้นสุดจะไม่สามารถสั่งรายการอาหารได้</p>
          </div>
          <div className="mt-5">
              <CardProduct productData={data.productData}/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePageFront;
