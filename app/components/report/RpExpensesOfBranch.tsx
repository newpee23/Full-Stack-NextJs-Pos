import React from 'react';
import HeadNameComponent from '../UI/HeadNameComponent';
import { DatePicker, Form } from 'antd';
import SearchBtn from '../UI/btn/SearchBtn';
import { dateFetchReport } from '@/types/fetchData';
import { getDateQuery } from '@/utils/utils';

const { RangePicker } = DatePicker;

const rangeConfig = {
  rules: [{ type: 'array' as const, required: true, message: 'กรุณาเลือกช่วงเวลาค้นหาข้อมูล' }],
};

interface FormValues {
  rangeRpExpensesOfBranch: [Date, Date]; // Array of two Date objects
}

const onFinish = (fieldsValue: FormValues) => {

  const formattedValues: dateFetchReport = {
    startDate: getDateQuery(fieldsValue.rangeRpExpensesOfBranch[0].toString()),
    endDate: getDateQuery(fieldsValue.rangeRpExpensesOfBranch[1].toString()),
  }

  console.log('Received values of form: ', formattedValues);
};

const RpExpensesOfBranch = () => {
  return (
    <div className="p-3">
      <HeadNameComponent name="รายงานค่าใช้จ่ายประจำสาขา" />
      <Form name="RpExpensesOfBranchForm" onFinish={onFinish} className="mt-5 flex w-full items-center justify-center">
        <Form.Item name="rangeRpExpensesOfBranch" label="เลือกช่วงเวลา" {...rangeConfig}>
          <RangePicker />
        </Form.Item>
        <Form.Item wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 8 } }}>
          <SearchBtn />
        </Form.Item>
      </Form>
    </div>
  );
};

export default RpExpensesOfBranch;
