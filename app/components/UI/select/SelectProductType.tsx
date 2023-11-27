import { fetchOptionAddProduct } from '@/types/fetchData';
import { Col, Form, Select } from 'antd';
import React from 'react'

type Props = { option: fetchOptionAddProduct | undefined; }

const SelectProductType = ({ option }: Props) => {
    return (
        <Col>
            <Form.Item name="productTypeId" label="ประเภทสินค้า"
                rules={[
                    {
                        required: true,
                        message: "กรุณาเลือกประเภทสินค้า",
                    },
                ]}
            >
                <Select showSearch placeholder="เลือกประเภทสินค้า" optionFilterProp="children" options={option?.productType} allowClear
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                />
            </Form.Item>
        </Col>
    )
}

export default SelectProductType