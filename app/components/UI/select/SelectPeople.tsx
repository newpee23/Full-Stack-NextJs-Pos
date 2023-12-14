import { Col, Form, Select } from "antd";
import React from "react";

type Props = {
    options: { value: string;label: string; }[];

}

const SelectPeople = ({options}: Props) => {
    return (
        <Col>
            <Form.Item
                name="peoples"
                label="เลือกจำนวนลูกค้า"
                rules={[{ required: true, message: "กรุณาเลือกจำนวนลูกค้า" }]}
            >
                <Select className="min-w-[180px]" options={options} placeholder={"เลือกจำนวนลูกค้า"} />
            </Form.Item>
        </Col>
    )
}

export default SelectPeople;