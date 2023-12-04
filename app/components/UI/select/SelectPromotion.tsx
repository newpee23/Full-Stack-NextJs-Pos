
import { fetchOptionAddPromotionItem } from '@/types/fetchData';
import { Col, Form, Select } from 'antd';
import React from 'react'

type Props = { option: fetchOptionAddPromotionItem | undefined; }

const SelectPromotion = ({ option }: Props) => {
    return (
        <Col>
            <Form.Item name="promotionId" label="หัวข้อโปรโมชั่น"
                rules={[
                    {
                        required: true,
                        message: "กรุณาเลือกหัวข้อโปรโมชั่น",
                    },
                ]}
            >
                <Select showSearch placeholder="เลือกหัวข้อโปรโมชั่น" optionFilterProp="children" options={option?.promotion} allowClear
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                />
            </Form.Item>
        </Col>
    )
}

export default SelectPromotion;