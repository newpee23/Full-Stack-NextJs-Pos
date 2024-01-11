import React from "react";
import HeadNameComponent from "../UI/HeadNameComponent";
import { DatePicker, Form } from "antd";
import SearchBtn from "../UI/btn/SearchBtn";
import { dateFetchReport } from "@/types/fetchData";
import { getDateQuery } from "@/utils/utils";
import SelectBranchArr from "../UI/select/ArrValue/SelectBranchArr";

const { RangePicker } = DatePicker;

const rangeConfig = {
  rules: [{ type: "array" as const, required: true, message: "กรุณาเลือกช่วงเวลา" }],
};

const branchConfig = {
  rules: [{ type: "array" as const, required: true, message: "กรุณาเลือกสาขา" }],
};

interface FormValues {
  rangeRpSummaryOfBranchForm: [Date, Date]; // Array of two Date objects
}

const onFinish = (fieldsValue: FormValues) => {

  const formattedValues: dateFetchReport = {
    startDate: getDateQuery(fieldsValue.rangeRpSummaryOfBranchForm[0].toString()),
    endDate: getDateQuery(fieldsValue.rangeRpSummaryOfBranchForm[1].toString()),
  }

  console.log("Received values of form: ", formattedValues);
};

const RpSummaryOfBranch = () => {
  return (
    <div className="p-3">
      <HeadNameComponent name="รายงานสรุปยอดขายประจำสาขา" />
      <Form name="RpSummaryOfBranchForm" onFinish={onFinish} className="mt-5 w-full">
        <div className="flex items-center flex-col lg:flex-row justify-center">
          <div className="w-full lg:w-auto">
            <Form.Item name="branchRpSummaryOfBranchForm" label="เลือกสาขา" {...branchConfig}>
              <SelectBranchArr />
            </Form.Item>
          </div>
          <div className="w-full lg:w-auto sml:mt-2 sml:mx-8">
            <Form.Item name="rangeRpSummaryOfBranchForm" label="เลือกช่วงเวลา" {...rangeConfig}>
              <RangePicker style={{ width: '300px', textAlign: 'center' }}/>
            </Form.Item>
          </div>
          <div className="mt-2">
            <Form.Item>
              <SearchBtn />
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default RpSummaryOfBranch;
