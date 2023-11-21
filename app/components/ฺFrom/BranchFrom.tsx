"use client"
import React, { useEffect, useState } from "react";
import { Col, DatePicker, Form, Input, message, Row, Select } from "antd";

import { convertStatusToOption, optionStatus, parseDateStringToMoment, validateExpirationDate, validateWhitespace } from "./validate/validate";
import SaveBtn from "../UI/SaveBtn";
import moment, { Moment } from "moment";

import { useSession } from "next-auth/react";
import { useAddDataBranch, useUpdateDataBranch } from "@/app/api/branch";
import { useAppDispatch } from "@/app/store/store";
import { setLoading } from "@/app/store/slices/loadingSlice";
import ProgressBar from "../UI/ProgressBar";
import { DataTypeBranch } from "@/types/columns";
import DrawerActionData from "../DrawerActionData";

interface branchSubmit {
    name: string;
    codeReceipt: string;
    address: string;
    expiration: Moment | undefined;
    phone: string;
    status: { value: string, label: string };
}

interface Props {
    onClick: () => void;
    editData?: DataTypeBranch;
    title: string;
    statusAction: "add" | "update";
};

const BranchFrom = ({ onClick, editData, title, statusAction }: Props) => {

    const dispatch = useAppDispatch();
    const addDataBranchMutation = useAddDataBranch();
    const updateDataBranchMutation = useUpdateDataBranch();
    const { data: session } = useSession();
    const [messageApi, contextHolder] = message.useMessage();
    const [loadingQuery, setLoadingQuery] = useState<number>(0);
    const [messageError, setMessageError] = useState<{ message: string }[]>([]);
    const [formValues, setFormValues] = useState<branchSubmit>({
        name: "",
        codeReceipt: "",
        address: "",
        expiration: undefined,
        phone: "",
        status: { value: "Active", label: "เปิดใช้งาน" },
    });

    const handleSubmit = async (values: object) => {

        const dataFrom: branchSubmit = values as branchSubmit;
        setLoadingQuery(0);
        dispatch(setLoading({ loadingAction: 0, showLoading: true }));

        try {
            if (!session?.user.company_id) {
                return showMessage({ status: "error", text: "พบข้อผิดพลาดกรุณาเข้าสู่ระบบใหม่อีกครั้ง" });
            }
            // UpdateBranch
            if (editData?.key) {
                const updateBranch = await updateDataBranchMutation.mutateAsync({
                    token: session?.user.accessToken,
                    branchData: {
                        id: parseInt(editData.key, 10),
                        name: dataFrom.name,
                        codeReceipt: dataFrom.codeReceipt,
                        address: dataFrom.address,
                        expiration: dataFrom.expiration ? dataFrom.expiration.toDate() : moment().toDate(),
                        phone: dataFrom.phone,
                        companyId: session?.user.company_id,
                        status: dataFrom.status.value === "Active" ? "Active" : "InActive",
                    },
                    setLoadingQuery: setLoadingQuery
                });

                if (updateBranch === null) return showMessage({ status: "error", text: "แก้ไขข้อมูลสาขาไม่สำเร็จ กรุณาลองอีกครั้ง" });
                if (updateBranch?.status === true) {
                    setTimeout(() => { onClick(); }, 1500);
                    return showMessage({ status: "success", text: "แก้ไขข้อมูลสาขาสำเร็จ" });
                }
                if (typeof updateBranch.message !== 'string') setMessageError(updateBranch.message);
                return showMessage({ status: "error", text: "แก้ไขข้อมูลสาขาไม่สำเร็จ กรุณาแก้ไขข้อผิดพลาด" });
            }
            // Insert Branch
            const addBranch = await addDataBranchMutation.mutateAsync({
                token: session?.user.accessToken,
                branchData: {
                    name: dataFrom.name,
                    codeReceipt: dataFrom.codeReceipt,
                    address: dataFrom.address,
                    expiration: dataFrom.expiration ? dataFrom.expiration.toDate() : moment().toDate(),
                    phone: dataFrom.phone,
                    companyId: session?.user.company_id,
                    status: dataFrom.status.value === "Active" ? "Active" : "InActive",
                },
                setLoadingQuery: setLoadingQuery
            });

            if (addBranch === null) return showMessage({ status: "error", text: "เพิ่มข้อมูลสาขาไม่สำเร็จ กรุณาลองอีกครั้ง" });
            if (addBranch?.status === true) {
                setTimeout(() => { onClick(); }, 1500);
                return showMessage({ status: "success", text: "เพิ่มข้อมูลสาขาสำเร็จ" });
            }
            if (typeof addBranch.message !== 'string') setMessageError(addBranch.message);
            return showMessage({ status: "error", text: "เพิ่มข้อมูลสาขาไม่สำเร็จ กรุณาแก้ไขข้อผิดพลาด" });
        } catch (error: unknown) {
            console.error('Failed to add data:', error);
        }
    };

    const showMessage = ({ status, text }: { status: string, text: string }) => {
        if (status === 'success') { messageApi.success(text); }
        else if (status === 'error') { messageApi.error(text); }
        else if (status === 'warning') { messageApi.warning(text); }
    };

    const resetForm = () => {
        if (statusAction === "update") {
            if (editData?.key) {
                setFormValues({
                    name: editData.name,
                    codeReceipt: editData.codeReceipt,
                    address: editData.address,
                    expiration: parseDateStringToMoment(editData.expiration),
                    phone: editData.phone,
                    status: convertStatusToOption(editData.status),
                });
            }else{
                setFormValues({
                    name: "",
                    codeReceipt: "",
                    address: "",
                    expiration: undefined,
                    phone: "",
                    status: { value: "Active", label: "เปิดใช้งาน" },
                });
            }
            if(messageError.length > 0)  setMessageError([]);
        }
    };

    useEffect(() => {
        const loadComponents = () => {
            if (loadingQuery > 0) { dispatch(setLoading({ loadingAction: loadingQuery, showLoading: true })); }
        };

        loadComponents();
    }, [loadingQuery]);

    useEffect(() => {
        const setInitialEditValues = () => {
            if (editData?.key) {
                setFormValues({
                    name: editData.name,
                    codeReceipt: editData.codeReceipt,
                    address: editData.address,
                    expiration: parseDateStringToMoment(editData.expiration),
                    phone: editData.phone,
                    status: convertStatusToOption(editData.status),
                });
            }
        }
        setInitialEditValues();
    }, [editData]);

    const MyForm = ({ onFinish }: { onFinish: (values: object) => void }): React.JSX.Element => {
        return (
            <Form layout="vertical" onFinish={(values) => { setFormValues(values as branchSubmit); onFinish(values); }} initialValues={formValues}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="name" label="ชื่อสาขา"
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
                        <Form.Item name="codeReceipt" label="รหัสใบเสร็จ"
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
                        <Form.Item name="address" label="ที่อยู่สาขา"
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
                        <Form.Item name="expiration" label="วันหมดอายุสาขา"
                            rules={[
                                { required: true, message: "กรุณาเลือกวันหมดอายุสาขา" },
                                { validator: validateExpirationDate },
                            ]}
                        >
                            <DatePicker style={{ width: "100%" }} showTime={{ format: "HH:mm" }} format="YYYY-MM-DD HH:mm" getPopupContainer={(trigger) => trigger.parentElement!} placeholder="ว/ด/ป เวลา" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="phone" label="เบอร์โทรศัพท์"
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
                        <Form.Item name="status" label="สถานะ"
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
                <ProgressBar />
                <SaveBtn label="บันทึกข้อมูล" />
            </Form>
        );
    };

    return (
        <div>
            {contextHolder}
            <DrawerActionData resetForm={resetForm} formContent={<MyForm onFinish={handleSubmit} />} title={title} showError={messageError} statusAction={statusAction} />
        </div>
    );
};

export default BranchFrom;
