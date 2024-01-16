import React, { useState } from "react";
import HeadNameComponent from "../UI/HeadNameComponent";
import { DatePicker, Form, Select, SelectProps, Spin } from "antd";
import SearchBtn from "../UI/btn/SearchBtn";
import { dateFetchReport, fetchRpSummaryOfBranchType } from "@/types/fetchData";
import { getDateQuery, typeNumber } from "@/utils/utils";
import { branchConfig, rangeConfig } from "../ฺFrom/validate/validate";
import { useSession } from "next-auth/react";
import { useSearchDataRpSummaryOfBranch, useSelectOpRpSummaryOfBranch } from "@/app/api/rp/RpSummaryOfBranch";
import SkeletonTable from "../UI/loading/SkeletonTable";
import ErrPage from "../ErrPage";
import { dataVerifyRpSummaryOfBranch } from "@/types/verify";
import RpSummaryOfBranchTable from "../Table/report/RpSummaryOfBranchTable";
import EmptyNodata from "../UI/EmptyNodata";
const { RangePicker } = DatePicker;

const RpSummaryOfBranch = () => {

  const { data: session } = useSession();
  const { data, isLoading, isError, refetch, remove } = useSelectOpRpSummaryOfBranch(session?.user.accessToken, session?.user.company_id);
  const searchDataRpSummaryOfBranch = useSearchDataRpSummaryOfBranch();
  const [searchData, setSearchData] = useState<fetchRpSummaryOfBranchType | null>(null);
  const [loading, setLoading] = useState(false);

  if (isLoading) {
    return <SkeletonTable />
  }

  if (isError) {
    return <ErrPage />
  }

  const handleSubmit = async (fieldsValue: dataVerifyRpSummaryOfBranch) => {
    try {
      setLoading(() => true);
      const formattedValues: dateFetchReport = {
        branchRpSummaryOfBranchForm: fieldsValue.branchRpSummaryOfBranchForm,
        rangeRpSummaryOfBranchForm: {
          startDate: getDateQuery(fieldsValue.rangeRpSummaryOfBranchForm[0].toString()),
          endDate: getDateQuery(fieldsValue.rangeRpSummaryOfBranchForm[1].toString())
        }
      }

      const rpSummaryOfBranch = await searchDataRpSummaryOfBranch.mutateAsync({
        token: session?.user.accessToken,
        dataRP: formattedValues
      });

      if (rpSummaryOfBranch?.resultRpSummaryOfBranch === null) {
        return setSearchData(() => null);
      }
      return setSearchData(() => rpSummaryOfBranch);
    } catch (error) {
      console.log("Error :", error);
    } finally {
      setLoading(() => false);
    }
  };

  return (

    <div className="p-3">
      <HeadNameComponent name="รายงานสรุปยอดขายประจำสาขา" />
      <Form name="RpSummaryOfBranchForm" onFinish={(values: dataVerifyRpSummaryOfBranch) => handleSubmit(values)} className="mt-5 w-full">
        <div className="w-full flex items-center gap-5 justify-center flex-col xl:flex-row">
          <Form.Item name="branchRpSummaryOfBranchForm" label="เลือกสาขา" {...branchConfig}>
            <Select mode="multiple" size="middle" placeholder="Please select" className="w-full max-w-[250px] min-w-200px" options={data} />
          </Form.Item>
          <Form.Item name="rangeRpSummaryOfBranchForm" label="เลือกช่วงเวลา" {...rangeConfig}>
            <RangePicker className="w-full max-w-[300px] text-center" />
          </Form.Item>
          <Form.Item>
            <SearchBtn />
          </Form.Item>
        </div>
      </Form>
      {/* Contents */}
      {loading ?
        <SkeletonTable />
        : searchData === null ?
          <EmptyNodata />
          :
          <div>
            <div className="mt-5 text-center p-4">
              <p className="text-md">สาขา : {searchData.branch}</p>
              <p className="text-md my-1">เวลา : {searchData.startDate} - {searchData.endDate}</p>
              <p className="text-sm text-orange-600">หมายเหตุ : ข้อมูลจะคำนวนเฉพาะบิลที่ถูกปิดแล้ว และมีสถานะการส่งออเดอร์สำเร็จเท่านั้น</p>
            </div>
            {searchData.resultRpSummaryOfBranch.length > 0 ?
              <RpSummaryOfBranchTable data={searchData.resultRpSummaryOfBranch} startDate={searchData.startDate} endDate={searchData.endDate}/>
              :
              <EmptyNodata />}
          </div>
      }
    </div>

  );
};

export default RpSummaryOfBranch;
