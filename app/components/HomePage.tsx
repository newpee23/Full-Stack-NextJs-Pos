import React from "react";
import { Card } from "antd";
import { useSession } from "next-auth/react";
import SkeletonTable from "./UI/loading/SkeletonTable";
import ErrPage from "./ErrPage";
import AddBtnBill from "./UI/btn/AddBtnBill";
import TagStatus from "./UI/TagStatus";
import CloseBtnBill from "./UI/btn/CloseBtnBill";
import CountdownTime from "./UI/CountdownTime";
import SegmentedShow from "./UI/SegmentedShow";
import { useDataTransaction } from "../api/transaction";

const HomePage = () => {

  const { data: session } = useSession();
  const { data, isLoading, isError, refetch, remove } = useDataTransaction(session?.user.accessToken, session?.user.branch_id);

  const handleRefresh = () => {
    remove();
    return refetch();
  };


  if (isLoading) {
    return <SkeletonTable />;
  }

  if (isError) {
    return <ErrPage onClick={handleRefresh} />;
  }

  return (
    <div>
      <div className="w-full text-center p-5">
        <SegmentedShow />
      </div>
      <div className="grid p-5 gap-5 grid-cols-1 mdl:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

        <Card title="โต๊ะที่ 1" className="bg-slate-50 border border-stone-100 text-sm" hoverable bordered={false}>
          <div className="flex items-center justify-between p-2">
            <p>จำนวนลูกค้า : 1/4</p>
            <AddBtnBill onClick={() => console.log("ssss")} label="เปิดบิล" />
          </div>
          <div className="flex items-center justify-between p-2">
            <p>จำนวนเตา : 2</p>
            <CountdownTime />
          </div>
          <div className="p-2">
            <p>เวลาเปิดบิล : -</p>
          </div>
          <div className="flex items-center justify-between p-2">
            <p>เวลาปิดบิล: -</p>
            <TagStatus color="success" textShow="ใช้งาน" />
          </div>
        </Card>

        <Card title="โต๊ะที่ 2" className="bg-slate-50 border border-stone-100 text-sm" hoverable bordered={false}>
          <div className="flex items-center justify-between p-2">
            <p>จำนวนลูกค้า : 4/4</p>
            <CloseBtnBill onClick={() => console.log("ssss")} label="  ปิดบิล" />
          </div>
          <div className="flex items-center justify-between p-2">
            <p>จำนวนเตา : 2</p>
            <CountdownTime />
          </div>
          <div className="p-2">
            <p>เวลาเปิดบิล : 11/01/2024 04:15</p>
          </div>
          <div className="flex items-center justify-between p-2">
            <p>เวลาปิดบิล: 11/01/2024 06:15</p>
            <TagStatus color="error" textShow="ไม่ใช้งาน" />
          </div>
        </Card>

      </div>
    </div>
  );
};

export default HomePage;
