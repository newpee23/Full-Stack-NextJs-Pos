import { Col, DatePicker, Form, Input, InputNumber } from 'antd';
import React from 'react';
import { validateExpirationDate, validateWhitespace } from '../ฺFrom/validate/validate';

type Props = {
    name: string;
    label: string;
    required: boolean;
    type: "text" | "textArea" | "number" | "datePicker" | "float" | "hidden";
};

const InputFrom: React.FC<Props> = ({ name, label, required, type }) => {

    if (type === "text") {
        return (
            <Col>
                <Form.Item
                    name={name}
                    label={label}
                    rules={[
                        { required, message: `กรุณาระบุ${label}` },
                        {
                            pattern: /^[^!@#\$%\^\&*\(\)_\+\{\}\[\]:;<>,\.\?~\\\/-]+$/,
                            message: "ไม่สามารถระบุอักขระพิเศษได้",
                        },
                        { validator: validateWhitespace },
                    ]}
                >
                    <Input placeholder={`ระบุ${label}`} />
                </Form.Item>
            </Col>
        );
    }

    if (type === "textArea") {
        return (<Col>
            <Form.Item name={name} label={label}
                rules={[
                    {
                        required,
                        message: `กรุณาระบุ${label} หากไม่ระบุกรุณากรอก -`,
                    },
                    { validator: validateWhitespace },
                ]}
            >
                <Input.TextArea rows={4} placeholder={`${label} ไม่ระบุกรอก -`} />
            </Form.Item>
        </Col>
        );
    }

    if (type === "datePicker") {
        return (<Col>
            <Form.Item name={name} label={label}
                rules={[
                    { required, message: `กรุณาเลือก${label}` },
                    { validator: validateExpirationDate },
                ]}
            >
                <DatePicker style={{ width: "100%" }} showTime={{ format: "HH:mm" }} format="YYYY-MM-DD HH:mm" getPopupContainer={(trigger) => trigger.parentElement!} placeholder="ว/ด/ป เวลา" />
            </Form.Item>
        </Col>
        );
    }

    if (type === "float") {
        return (
            <Col>
                <Form.Item
                    name={name}
                    label={label}
                    rules={[
                        { required, message: `กรุณาระบุ${label}` },
                        {
                            pattern: /^\d+(\.\d{1,2})?$/,
                            message: "กรุณาระบุตัวเลขและทศนิยมไม่เกิน 2 ตำแหน่ง",
                        },
                        { validator: validateWhitespace },
                    ]}
                >
                    <Input type="number" step={0.01} placeholder={`ระบุ${label}`} />
                </Form.Item>
            </Col>
        );
    }

    if (type === "hidden") {
        return (
            <Col className="hidden">
                <Form.Item name={name} label={label}>
                    <Input type="number" step={0.01} placeholder={`ระบุ${label}`} />
                </Form.Item>
            </Col>
        );
    }

    return (
        <Col>
            <Form.Item
                name={name}
                label={label}
                rules={[
                    { required, message: `กรุณาระบุ${label}` },
                    { pattern: /^[0-9]*$/, message: `กรุณาระบุ${label}เป็นตัวเลขจำนวนเต็มเท่านั้น` },
                ]}
            >
                <InputNumber className="w-full" placeholder={`ระบุ${label}`} />
            </Form.Item>
        </Col>
    );

};

export default InputFrom;
