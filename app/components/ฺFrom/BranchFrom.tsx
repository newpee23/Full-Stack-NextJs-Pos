"use client"
import React, { useEffect, useState } from "react";
import { Col, DatePicker, Form, Input, message, Row, Select } from "antd";
import DrawerAdd from "../DrawerAdd";
import { optionStatus, validateExpirationDate, validateWhitespace } from "./validate/validate";
import SaveBtn from "../UI/SaveBtn";
import { Moment } from "moment";

import { useSession } from "next-auth/react";
import { useAddDataBranch } from "@/app/api/branch";
import { useAppDispatch } from "@/app/store/store";
import { setLoading } from "@/app/store/slices/loadingSlice";
import ProgressBar from "../UI/ProgressBar";

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
        <ProgressBar/>
        <SaveBtn label="บันทึกข้อมูล" />
    </Form>
);

const BranchFrom = ({ onClick }: Props) => {

    const dispatch = useAppDispatch();
    const [messageApi, contextHolder] = message.useMessage();
    const { data: session } = useSession();
    const addDataBranchMutation = useAddDataBranch();
    const [loadingQuery, setLoadingQuery] = useState<number>(0);
    const [messageError, setMessageError] = useState<{ message: string }[]>([]);
    const handleSubmit = async (values: object) => {

        const dataFrom: branchSubmit = values as branchSubmit;

        setLoadingQuery(0);
        dispatch(setLoading({loadingAction: 0,showLoading: true}));
        try {   
            if(!session?.user.company_id){
                return;
            }
            const result = await addDataBranchMutation.mutateAsync({
                token: session?.user.accessToken,
                branchData: {   name: dataFrom.name,
                    codeReceipt: dataFrom.codeReceipt,
                    address: dataFrom.address,
                    expiration: dataFrom.expiration.toDate(),
                    phone: dataFrom.phone,
                    companyId: session?.user.company_id, 
                    status: dataFrom.status === "Active" ? "Active" : "InActive",},
                setLoadingQuery: setLoadingQuery
            });
           
            if(result === null) return showMessage({ status: "error", text: "เพิ่มข้อมูลสาขาไม่สำเร็จ กรุณาลองอีกครั้ง" });
            
           if(result?.status === true){
            setTimeout(() => {
                onClick();
            }, 1000);
            return showMessage({ status: "success", text: "เพิ่มข้อมูลสาขาสำเร็จ" });
           }

           if(typeof result.message !== 'string') setMessageError(result.message);
           return showMessage({ status: "warning", text: "เพิ่มข้อมูลสาขาไม่สำเร็จ กรุณาแก้ไขข้อผิดพลาด" });
        } catch (error: unknown) {
            console.error('Failed to add data:', error);
        }
    };
    
    useEffect(() => {
        const loadComponents = () => {
            if(loadingQuery > 0){
                dispatch(setLoading({loadingAction: loadingQuery,showLoading: true}));
            }
        };

        loadComponents();
      }, [loadingQuery]);

      const showMessage = ({ status, text }: { status: string, text: string }) => {
        if (status === 'success') {
          messageApi.success(text);
        } else if (status === 'error') {
          messageApi.error(text);
        } else if (status === 'warning') {
          messageApi.warning(text);
        }
      };
      console.log(messageError)
    return <>{contextHolder}<DrawerAdd title="เพิ่มข้อมูลสาขา" showError={messageError} formContent={<MyForm onFinish={handleSubmit} />} /></>;
};

export default BranchFrom;
