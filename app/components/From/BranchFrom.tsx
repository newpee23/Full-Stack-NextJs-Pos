import React, { useEffect, useState } from "react";
import { Col, DatePicker, Form, Input, message, Row, Select } from "antd";

import { convertStatusToOption, optionStatus, parseDateStringToMoment, validateExpirationDate, validateWhitespace } from "./validate/validate";
import SaveBtn from "../UI/btn/SaveBtn";
import moment, { Moment } from "moment";

import { useSession } from "next-auth/react";
import { useAddDataBranch, useUpdateDataBranch } from "@/app/api/branch";
import { useAppDispatch } from "@/app/store/store";
import { setLoading } from "@/app/store/slices/loadingSlice";
import ProgressBar from "../UI/loading/ProgressBar";
import { DataTypeBranch } from "@/types/columns";
import DrawerActionData from "../DrawerActionData";
import InputFrom from "../UI/InputFrom";
import StatusFrom from "../UI/select/StatusFrom";

interface branchSubmit {
    name: string;
    codeReceipt: string;
    address: string;
    expiration: Moment | undefined;
    phone: string;
    status: string;
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
        status: "Active",
    });

    const handleSubmit = async (values: object) => {
        const dataFrom = values as branchSubmit;
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
                        status: dataFrom.status === "Active" ? "Active" : "InActive",
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
                    status: dataFrom.status === "Active" ? "Active" : "InActive",
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
                    status: editData.status,
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


    const MyForm = ({ onFinish }: { onFinish: (values: object) => void }): React.JSX.Element => {
        return (
            <Form layout="vertical" onFinish={(values) => { setFormValues(values as branchSubmit); onFinish(values); }} initialValues={formValues}>
               {/* ชื่อสาขา,รหัสใบเสร็จ */}
               <div className="grid gap-3 mb-3 grid-cols-1 sml:grid-cols-2">
                    <InputFrom label="ชื่อสาขา" name="name" required={true} type="text"/>
                    <InputFrom label="รหัสใบเสร็จ" name="codeReceipt" required={true} type="text"/>
               </div>
                {/* ที่อยู่สาขา */}
                <div className="grid gap-3 mb-3 grid-cols-1 sml:grid-cols-1">
                    <InputFrom label="ที่อยู่สาขา" name="address" required={true} type="textArea"/>
                </div>
                {/* วันหมดอายุสาขา,เบอร์โทรศัพท์ */}
                <div className="grid gap-3 mb-3 grid-cols-1 sml:grid-cols-2">
                    <InputFrom label="วันหมดอายุสาขา" name="expiration" required={true} type="datePicker"/>
                    <InputFrom label="เบอร์โทรศัพท์" name="phone" required={true} type="text"/>
                </div>
                {/* สถานะ */}
                <div className="grid gap-3 mb-3 grid-cols-1 sml:grid-cols-2">
                    <StatusFrom label="สถานะ" name="status" />
                </div>
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
