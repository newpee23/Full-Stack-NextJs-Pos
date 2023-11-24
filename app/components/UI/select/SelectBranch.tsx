import { fetchOptionAddTables } from '@/types/fetchData';
import { Col, Form, Select } from 'antd';
import React from 'react'

type Props = { data: fetchOptionAddTables | undefined; }

const SelectBranch = ({ data }: Props) => {
  return (
    <Col>
      <Form.Item name="branch" label="สาขา"
        rules={[
          {
            required: true,
            message: "กรุณาเลือกสาขา",
          },
        ]}
      >
        <Select showSearch placeholder="เลือกสาขา" optionFilterProp="children" options={data?.branch} allowClear
          filterOption={(input, option) => (option?.label ?? '').includes(input)}
          filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
        />
      </Form.Item>
    </Col>
  )
}

export default SelectBranch;