"use client"
import React, { useState } from "react";
import { Col, DatePicker, Form, Input, Row, Select } from "antd";
import DrawerAdd from "../DrawerAdd";
import { optionStatus, validateExpirationDate, validateWhitespace } from "./validate/validate";
import SaveBtn from "../UI/SaveBtn";
import { Moment } from "moment";
import { dataVerifyBranch } from "@/types/verify";
import { useSession } from "next-auth/react";
import { useAddDataBranch } from "@/app/api/branch";

interface branchSubmit {
    name: string;
    codeReceipt: string;
    address: string;
    expiration: Moment;
    phone: string;
    status: string;
}

interface Props { onClick: () => void; };

const MyForm = ({ onFinish }: { onFinish: (values: object) => void }): React.JSX.Element => (
    <Form layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
            <Col span={12}>
                <Form.Item name="name" label="ชื่อสาขา" hasFeedback
                    rules={[
                        { required: true, message: "กรุณาระบุชื่อสาขา" }
                        , {
                            pattern: /^[^!@#\$%\^\&*\(\)_\+\{\}\[\]:;<>,\.\?~\\\/-]+$/,
                            message: "ไม่สามารถระบุอักขระพิเศษได้",
                        },
                        { validator: validateWhitespace },
                    ]}
                >
                    <Input placeholder="ระบุรหัสสาขา" />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item name="codeReceipt" label="รหัสใบเสร็จ" hasFeedback
                    rules={[
                        { required: true, message: "กรุณาระบุรหัสใบเสร็จ" }
                        , {
                            pattern: /^[^!@#\$%\^\&*\(\)_\+\{\}\[\]:;<>,\.\?~\\\/-]+$/,
                            message: "ไม่สามารถระบุอักขระพิเศษได้",
                        },
                        { validator: validateWhitespace },
                    ]}
                >
                    <Input placeholder="ระบุรหัสใบเสร็จ" />
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={16}>
            <Col span={24}>
                <Form.Item name="address" label="ที่อยู่สาขา" hasFeedback
                    rules={[
                        {
                            required: true,
                            message: "ไม่ระบุกรุณากรอก -",
                        },
                        { validator: validateWhitespace },
                    ]}
                >
                    <Input.TextArea rows={4} placeholder="ที่อยู่สาขา ไม่ระบุกรอก -" />
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={16}>
            <Col span={12}>
                <Form.Item name="expiration" label="วันหมดอายุสาขา" hasFeedback
                    rules={[
                        { required: true, message: "กรุณาเลือกวันหมดอายุสาขา" },
                        { validator: validateExpirationDate },
                    ]}
                >
                    <DatePicker
                        style={{ width: "100%" }}
                        showTime={{ format: "HH:mm" }}
                        format="YYYY-MM-DD HH:mm"
                        getPopupContainer={(trigger) => trigger.parentElement!}
                        placeholder="ว/ด/ป เวลา"
                    />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item name="phone" label="เบอร์โทรศัพท์" hasFeedback
                    rules={[
                        { required: true, message: "กรุณาระบุเบอร์โทรศัพท์" },
                        { pattern: /^[0-9]*$/, message: "กรุณาระบุเบอร์โทรศัพท์เป็นตัวเลขเท่านั้น" },
                    ]}
                >
                    <Input placeholder="ระบุเบอร์โทรศัพท์" />
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={16}>
            <Col span={12}>
                <Form.Item name="status" label="สถานะ" hasFeedback
                    rules={[
                        {
                            required: true,
                            message: "กรุณาเลือกสถานะ",
                        },
                    ]}
                >
                    <Select
                        options={optionStatus}
                        placeholder="เลือกสถานะ"
                    />
                </Form.Item>
            </Col>
        </Row>
        <SaveBtn label="บันทึกข้อมูล" />
    </Form>
);

const BranchFrom = ({ onClick }: Props) => {
    const { data: session } = useSession();
    const addDataBranchMutation = useAddDataBranch();
   
    const convertBranchSubmitToDataVerifyBranch = (branchSubmit: branchSubmit): dataVerifyBranch => {
        return {
            name: branchSubmit.name,
            codeReceipt: branchSubmit.codeReceipt,
            address: branchSubmit.address,
            expiration: branchSubmit.expiration.toDate(), // ใช้ .toDate() เพื่อแปลง Moment เป็น Date
            phone: branchSubmit.phone,
            companyId: session?.user.company_id, // ตัวอย่างการกำหนดค่า companyId
            status: branchSubmit.status === "Active" ? "Active" : "InActive",
        };
    }

    const handleSubmit = async (values: object) => {
        const dataFrom: branchSubmit = values as branchSubmit;
        const dataVerifyBranchData: dataVerifyBranch = convertBranchSubmitToDataVerifyBranch(dataFrom);

        try {
            const result = await addDataBranchMutation.mutateAsync({
                token: session?.user.accessToken,
                branchData: dataVerifyBranchData,
            });

            console.log('Data added successfully:', result);
        } catch (error) {
            console.error('Failed to add data:', error);
        } finally {
            onClick();
        }
        // console.log("Form submitted with values:", dataFrom.expiration);
        console.log(session?.user.company_id)
    };

    return <DrawerAdd title="เพิ่มข้อมูลสาขา" formContent={<MyForm onFinish={handleSubmit} />} />;
};

export default BranchFrom;
