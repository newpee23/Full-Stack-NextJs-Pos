import React, { useState } from "react";
import HeadNameComponent from "../UI/HeadNameComponent";
import { DatePicker, Form, Select, SelectProps, Spin } from "antd";
import SearchBtn from "../UI/btn/SearchBtn";
import { dateFetchExpensesReport, fetchRpExpensesOfBranchType} from "@/types/fetchData";
import { getDateQuery, typeNumber } from "@/utils/utils";
import { branchConfig, rangeConfig } from "../ฺFrom/validate/validate";
import { useSession } from "next-auth/react";
import SkeletonTable from "../UI/loading/SkeletonTable";
import ErrPage from "../ErrPage";
import RpExpensesOfBranchTable from "../Table/report/RpExpensesOfBranchTable";
import EmptyNodata from "../UI/EmptyNodata";
import { useSearchDataRpExpensesOfBranch } from "@/app/api/rp/RpExpensesOfBranch";
import { useSelectOpRpSummaryOfBranch } from "@/app/api/rp/RpSummaryOfBranch";
import { dataVerifyRpExpensesOfBranch } from "@/types/verify";
const { RangePicker } = DatePicker;

const RpExpensesOfBranch = () => {

  const { data: session } = useSession();
  const { data, isLoading, isError, refetch, remove } = useSelectOpRpSummaryOfBranch(session?.user.accessToken, session?.user.company_id);
  const searchDataRpExpensesOfBranch = useSearchDataRpExpensesOfBranch();
  const [searchData, setSearchData] = useState<fetchRpExpensesOfBranchType | null>(null);
  const [loading, setLoading] = useState(false);

  if (isLoading) {
    return <SkeletonTable />
  }

  if (isError) {
    return <ErrPage />
  }

  const handleSubmit = async (fieldsValue: dataVerifyRpExpensesOfBranch) => {
    try {
      setLoading(() => true);
      const formattedValues: dateFetchExpensesReport = {
        branchRpExpensesOfBranchForm: fieldsValue.branchRpExpensesOfBranchForm,
        rangeRpExpensesOfBranchForm: {
          startDate: getDateQuery(fieldsValue.rangeRpExpensesOfBranchForm[0].toString()),
          endDate: getDateQuery(fieldsValue.rangeRpExpensesOfBranchForm[1].toString())
        }
      }

      const rpExpensesOfBranch = await searchDataRpExpensesOfBranch.mutateAsync({
        token: session?.user.accessToken,
        dataRP: formattedValues
      });

      if (rpExpensesOfBranch?.resultRpExpensesOfBranch === null) {
        return setSearchData(() => null);
      }
    
      return setSearchData(() => rpExpensesOfBranch);
    } catch (error) {
      console.log("Error :", error);
    } finally {
      setLoading(() => false);
    }
  };
  
  return (

    <div className="p-3">
      <HeadNameComponent name="รายงานค่าใช้จ่ายประจำสาขา" />
      <Form name="RpExpensesOfBranchForm" onFinish={(values: dataVerifyRpExpensesOfBranch) => handleSubmit(values)} className="mt-5 w-full">
        <div className="w-full flex items-center gap-5 justify-center flex-col xl:flex-row">
          <Form.Item name="branchRpExpensesOfBranchForm" label="เลือกสาขา" {...branchConfig}>
            <Select mode="multiple" size="middle" placeholder="Please select" className="w-full max-w-[250px] min-w-200px" options={data} />
          </Form.Item>
          <Form.Item name="rangeRpExpensesOfBranchForm" label="เลือกช่วงเวลา" {...rangeConfig}>
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
            {searchData.resultRpExpensesOfBranch.length > 0 ?
              <RpExpensesOfBranchTable data={searchData.resultRpExpensesOfBranch} startDate={searchData.startDate} endDate={searchData.endDate}/>
              :
              <EmptyNodata />}
          </div>
      }
    </div>

  );
};

export default RpExpensesOfBranch;
