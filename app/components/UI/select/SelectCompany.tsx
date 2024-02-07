import { optionSelect } from '@/types/fetchData';
import { Col, Form, Select } from 'antd';
import React from 'react'

type Props = { data: optionSelect[]; }

const SelectCompany = ({ data }: Props) => {
  return (
    <Col>
      <Form.Item name="company" label="บริษัท"
        rules={[
          {
            required: true,
            message: "กรุณาเลือกบริษัท",
          },
        ]}
      >
        <Select showSearch placeholder="เลือกบริษัท" optionFilterProp="children" options={data} allowClear
          filterOption={(input, option) => (option?.label ?? '').includes(input)}
          filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
        />
      </Form.Item>
    </Col>
  )
}

export default SelectCompany;