
import { fetchOptionAddPromotionItem } from '@/types/fetchData';
import { Col, Form, Select } from 'antd';
import React from 'react'

type Props = { 
    option: fetchOptionAddPromotionItem | undefined; 
}

const SelectProduct = ({ option }: Props) => {

    return (
        <Col>
            <Form.Item name="productId" label="สินค้า"
                rules={[
                    {
                        required: true,
                        message: "กรุณาเลือกสินค้า",
                    },
                ]}
            >
                <Select mode="multiple" showSearch placeholder="เลือกสินค้า" optionFilterProp="children" options={option?.product} allowClear
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                />
            </Form.Item>
        </Col>
    )
}

export default SelectProduct;