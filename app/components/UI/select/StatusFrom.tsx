import { Col, Form, Select } from 'antd'
import React from 'react'
import { optionStatus } from '../../ฺFrom/validate/validate'

type Props = {
    name: string;
    label: string;
}

const StatusFrom = ({ name, label }: Props) => {
    return (
        <Col>
            <Form.Item
                name={name}
                label={label}
                rules={[{ required: true, message: `กรุณาเลือก${name}` }]}
            >
                <Select options={optionStatus} placeholder={`เลือก${name}`} />
            </Form.Item>
        </Col>
    )
}

export default StatusFrom;