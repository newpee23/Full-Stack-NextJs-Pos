import { useAddDataUnit, useUpdateDataUnit } from '@/app/api/unit';
import { setLoading } from '@/app/store/slices/loadingSlice';
import { useAppDispatch } from '@/app/store/store';
import { fetchUnit } from '@/types/fetchData';
import { Col, Form, Input, Row, Select, message } from 'antd';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { optionStatus, validateWhitespace } from './validate/validate';
import ProgressBar from '../UI/ProgressBar';
import SaveBtn from '../UI/SaveBtn';
import DrawerActionData from '../DrawerActionData';

type Props = {
    onClick: () => void;
    editData?: fetchUnit;
    title: string;
    statusAction: "add" | "update";
}

interface unitSubmit {
    name: string;
    status: string;
}

function UnitFrom({ onClick, title, statusAction, editData }: Props) {
    const dispatch = useAppDispatch();
    const { data: session } = useSession();
    const [messageApi, contextHolder] = message.useMessage();
    const addDataUnitMutation = useAddDataUnit();
    const updateDataUnitMutation = useUpdateDataUnit();
    const [messageError, setMessageError] = useState<{ message: string }[]>([]);
    const [loadingQuery, setLoadingQuery] = useState<number>(0);
    const [formValues, setFormValues] = useState<unitSubmit>({
        name: "",
        status: "Active",
    });

    const showMessage = ({ status, text }: { status: string, text: string }) => {
        if (status === "success") { messageApi.success(text); }
        else if (status === "error") { messageApi.error(text); }
        else if (status === "warning") { messageApi.warning(text); }
    };

    const resetForm = () => {
        if (statusAction === "update") {
            if (editData?.key) {
                setFormValues({
                    name: editData.name,
                    status: editData.status,
                });
            }
            if (messageError.length > 0) setMessageError([]);
        }
    };

    const handleSubmit = async (values: object) => {
        const dataFrom = values as unitSubmit;
        setLoadingQuery(0);
        dispatch(setLoading({ loadingAction: 0, showLoading: true }));

        try {
            if (!session?.user.company_id) {
                return showMessage({ status: "error", text: "พบข้อผิดพลาดกรุณาเข้าสู่ระบบใหม่อีกครั้ง" });
            }
            // updatePosition
            if (editData?.key) {
                const updateUnit = await updateDataUnitMutation.mutateAsync({
                    token: session?.user.accessToken,
                    unitData: {
                        id: parseInt(editData.key, 10),
                        name: dataFrom.name,
                        companyId: session?.user.company_id,
                        status: dataFrom.status === "Active" ? "Active" : "InActive",
                    },
                    setLoadingQuery: setLoadingQuery
                });

                if (updateUnit === null) return showMessage({ status: "error", text: "แก้ไขข้อมูลหน่วยนับสินค้าไม่สำเร็จ กรุณาลองอีกครั้ง" });
                if (updateUnit?.status === true) {
                    setTimeout(() => { onClick(); }, 1500);
                    return showMessage({ status: "success", text: "แก้ไขข้อมูลหน่วยนับสินค้าสำเร็จ" });
                }
                if (typeof updateUnit.message !== 'string') setMessageError(updateUnit.message);
                return showMessage({ status: "error", text: "แก้ไขข้อมูลหน่วยนับสินค้าไม่สำเร็จ กรุณาแก้ไขข้อผิดพลาด" });
            }
            // Insert Expenses
            const updateUnit = await addDataUnitMutation.mutateAsync({
                token: session?.user.accessToken,
                unitData: {
                    name: dataFrom.name,
                    companyId: session?.user.company_id,
                    status: dataFrom.status === "Active" ? "Active" : "InActive",
                },
                setLoadingQuery: setLoadingQuery
            });

            if (updateUnit === null) return showMessage({ status: "error", text: "เพิ่มข้อมูลหน่วยนับสินค้าไม่สำเร็จ กรุณาลองอีกครั้ง" });
            if (updateUnit?.status === true) {
                setTimeout(() => { onClick(); }, 1500);
                return showMessage({ status: "success", text: "เพิ่มข้อมูลหน่วยนับสินค้าสำเร็จ" });
            }
            if (typeof updateUnit.message !== 'string') setMessageError(updateUnit.message);
            return showMessage({ status: "error", text: "เพิ่มข้อมูลหน่วยนับสินค้า กรุณาแก้ไขข้อผิดพลาด" });
        } catch (error: unknown) {
            console.error('Failed to add data:', error);
        }
    };

    useEffect(() => {
        const loadComponents = () => {
            if (loadingQuery > 0) { dispatch(setLoading({ loadingAction: loadingQuery, showLoading: true })); }
        };

        loadComponents();
    }, [loadingQuery]);

    const MyForm = ({ onFinish }: { onFinish: (values: object) => void }): React.JSX.Element => {
        return (
            <Form layout="vertical" onFinish={(values) => { setFormValues(values as unitSubmit); onFinish(values); }} initialValues={formValues}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="name" label="ชื่อตำแหน่งพนักงาน"
                            rules={[
                                { required: true, message: "กรุณาระบุชื่อตำแหน่งพนักงาน" }
                                , {
                                    pattern: /^[^!@#\$%\^\&*\(\)_\+\{\}\[\]:;<>,\.\?~\\\/-]+$/,
                                    message: "ไม่สามารถระบุอักขระพิเศษได้",
                                },
                                { validator: validateWhitespace },
                            ]}
                        >
                            <Input placeholder="ระบุชื่อตำแหน่งพนักงาน" />
                        </Form.Item>
                    </Col>
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
    )
}

export default UnitFrom