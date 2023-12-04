import { Col, Form, Select } from 'antd'
import React from 'react'
import { optionStatus } from '../../ฺFrom/validate/validate'

type Props = {
    label: string;
    name: string;
}

const StatusFrom = ({ label, name }: Props) => {
    return (
        <Col>
            <Form.Item
                name={name}
                label={label}
                rules={[{ required: true, message: `กรุณาเลือก${label}` }]}
            >
                <Select options={optionStatus} placeholder={`เลือก${label}`} />
            </Form.Item>
        </Col>
    )
}

export default StatusFrom;