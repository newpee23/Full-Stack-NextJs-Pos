import React, { useState } from "react";
import SegmentedShow from "./UI/SegmentedShow";
import { SegmentedValue } from "antd/lib/segmented";
import TransactionTable from "./Table/TransactionTable";
import HeadNameComponent from "./UI/HeadNameComponent";

const HomePage = () => {
  const [segmentedShow, setSegmentedShow] = useState<SegmentedValue>("1");

  return (
    <div>
      <HeadNameComponent name="จัดการข้อมูลเปิดบิลขาย" />
      <div className="w-full text-center p-5">
        <SegmentedShow setSegmentedShow={setSegmentedShow} />
      </div>
      <div>
        <TransactionTable segmentedShow={segmentedShow} />
      </div>
    </div>
  );
};

export default HomePage;
