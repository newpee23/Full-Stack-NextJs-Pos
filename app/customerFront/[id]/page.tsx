"use client"
import ErrPage from "@/app/components/ErrPage";
import MenuFront from "@/app/components/MenuFront";
import Navbar from "@/app/components/Navbar";
import CountdownTime from "@/app/components/UI/CountdownTime";
import CardProduct from "@/app/components/UI/card/CardProduct";
import React from "react";

interface HomePageFrontProps {
  params: {
    id: string;
  };
}

const HomePageFront = ({ params }: HomePageFrontProps) => {
  const { id } = params;

  if (!id) {
    return <ErrPage />;
  }

  return (
    <section>
      <Navbar page="customerFront"/>
      <div className="mt-14 flex">
        <MenuFront onMenuClick={() => console.log("sss")}/>
        <div className="w-full p-3">
          <div className="mt-3 text-center">
            <p className="text-lg">โต๊ะ 1 (4 ท่าน)</p>
            <p>วันที่ใช้บริการ 12/12/2023</p> 
            <p>เวลาเริ่มต้น 20:00 เวลาสิ้นสุด 22:00</p>
            <CountdownTime time={120} startOrder={new Date()} />
            <p className="text-orange-600 text-xs">*เมื่อถึงเวลาสิ้นสุดจะไม่สามารถสั่งรายการอาหารได้</p>
          </div>
          <div className="mt-3">
            <CardProduct />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePageFront;
