import { fetchOptionAddProduct } from '@/types/fetchData';
import { Col, Form, Select } from 'antd';
import React from 'react'

type Props = { option: fetchOptionAddProduct | undefined; }

const SelectUnit = ({ option }: Props) => {
    return (
        <Col>
            <Form.Item name="unitId" label="หน่วยนับ"
                rules={[
                    {
                        required: true,
                        message: "กรุณาเลือกหน่วยนับ",
                    },
                ]}
            >
                <Select showSearch placeholder="เลือกหน่วยนับ" optionFilterProp="children" options={option?.unit} allowClear
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                />
            </Form.Item>
        </Col>
    )
}

export default SelectUnit