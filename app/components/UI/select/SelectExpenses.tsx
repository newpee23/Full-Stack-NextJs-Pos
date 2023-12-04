
import { fetchOptionAddExpensesItem } from '@/types/fetchData';
import { Col, Form, Select } from 'antd';
import React from 'react'

type Props = { option: fetchOptionAddExpensesItem | undefined; }

const SelectExpenses = ({ option }: Props) => {
    return (
        <Col>
            <Form.Item name="expensesId" label="หัวข้อค่าใช้จ่าย"
                rules={[
                    {
                        required: true,
                        message: "กรุณาเลือกหัวข้อค่าใช้จ่าย",
                    },
                ]}
            >
                <Select showSearch placeholder="เลือกหัวข้อค่าใช้จ่าย" optionFilterProp="children" options={option?.expenses} allowClear
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                />
            </Form.Item>
        </Col>
    )
}

export default SelectExpenses;