import { setLoading } from "@/app/store/slices/loadingSlice";
import { useAppDispatch } from "@/app/store/store";
import { Col, Form, Input, Row, Select, Skeleton, message } from "antd";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react"
import { optionRole, optionStatus, validateWhitespace } from "./validate/validate";
import ProgressBar from "../UI/loading/ProgressBar";
import SaveBtn from "../UI/btn/SaveBtn";
import DrawerActionData from "../DrawerActionData";
import { useAddDataEmployee, useSelectOpEmployee, useUpdateDataEmployee } from "@/app/api/employee";
import ErrPage from "../ErrPage";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { fetchEmployee } from "@/types/fetchData";

interface employeeSubmit {
    name: string;
    subname: string;
    age: string;
    cardId: string;
    userName: string;
    passWord: string;
    branch: number | undefined;
    position: number | undefined;
    role: string;
    status: string;
}

interface Props {
    onClick: () => void;
    editData?: fetchEmployee;
    title: string;
    statusAction: "add" | "update";
};

const EmployeeFrom = ({ onClick, title, statusAction, editData }: Props) => {
    const dispatch = useAppDispatch();
    const { data: session } = useSession();
    const { data, isLoading, isError, refetch, remove } = useSelectOpEmployee(session?.user.accessToken, session?.user.company_id);
    const [messageApi, contextHolder] = message.useMessage();
    const addDataEmployeeMutation = useAddDataEmployee();
    const updateDataEmployeeMutation = useUpdateDataEmployee();
    const [messageError, setMessageError] = useState<{ message: string }[]>([]);
    const [loadingQuery, setLoadingQuery] = useState<number>(0);
    const [formValues, setFormValues] = useState<employeeSubmit>({
        name: "",
        subname: "",
        age: "",
        cardId: "",
        userName: "",
        passWord: "",
        branch: undefined,
        position: undefined,
        role: "user",
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
                    subname: editData.subname,
                    age: editData.age.toString(),
                    cardId: editData.cardId,
                    userName: editData.userName,
                    passWord: "abc123456789",
                    branch: editData.branchId,
                    position: editData.positionId,
                    role: editData.role,
                    status: editData.status,
                });
            }
            if(messageError.length > 0)  setMessageError([]);
        }
    };

    const handleRefresh = () => {
        remove();
        return refetch();
    }

    const handleSubmit = async (values: object) => {
        const dataFrom = values as employeeSubmit;
        setLoadingQuery(0);
        dispatch(setLoading({ loadingAction: 0, showLoading: true }));
        // Update Employee
        try {
            if (!session?.user.company_id) return showMessage({ status: "error", text: "พบข้อผิดพลาดกรุณาเข้าสู่ระบบใหม่อีกครั้ง" });
            if (!dataFrom.branch) return showMessage({ status: "error", text: "กรุณาเลือกสาขา" });
            if (!dataFrom.position) return showMessage({ status: "error", text: "กรุณาเลือกตำแหน่งพนักงาน" });
            // Update Employee
            if (editData?.key) {
                const updateEmployee= await updateDataEmployeeMutation.mutateAsync({
                    token: session?.user.accessToken,
                    employeeData: {
                        id: parseInt(editData.key, 10),
                        name: dataFrom.name,
                        subname: dataFrom.subname,
                        age: parseInt(dataFrom.age, 10),
                        cardId: dataFrom.cardId,
                        userName: dataFrom.userName,
                        passWord: dataFrom.passWord,
                        companyId: session?.user.company_id,
                        branchId: dataFrom.branch,
                        positionId: dataFrom.position,
                        role: dataFrom.role === "user" ? "user" : "userAdmin",
                        status: dataFrom.status === "Active" ? "Active" : "InActive",
                    },
                    setLoadingQuery: setLoadingQuery
                });

                if (updateEmployee === null) return showMessage({ status: "error", text: "แก้ไขข้อมูลพนักงานไม่สำเร็จ กรุณาลองอีกครั้ง" });
                if (updateEmployee?.status === true) {
                    setTimeout(() => { onClick(); }, 1500);
                    return showMessage({ status: "success", text: "แก้ไขข้อมูลพนักงานสำเร็จ" });
                }
                if (typeof updateEmployee.message !== 'string') setMessageError(updateEmployee.message);
                return showMessage({ status: "error", text: "แก้ไขข้อมูลพนักงานไม่สำเร็จ กรุณาแก้ไขข้อผิดพลาด" });
            }
            // Insert Employee
            const addEmployee = await addDataEmployeeMutation.mutateAsync({
                token: session?.user.accessToken,
                employeeData: {
                    name: dataFrom.name,
                    subname: dataFrom.subname,
                    age: parseInt(dataFrom.age, 10),
                    cardId: dataFrom.cardId,
                    userName: dataFrom.userName,
                    passWord: dataFrom.passWord,
                    companyId: session?.user.company_id,
                    branchId: dataFrom.branch,
                    positionId: dataFrom.position,
                    role: dataFrom.role === "user" ? "user" : "userAdmin",
                    status: dataFrom.status === "Active" ? "Active" : "InActive",
                },
                setLoadingQuery: setLoadingQuery
            });

            if (addEmployee === null) return showMessage({ status: "error", text: "เพิ่มข้อมูลพนักงานไม่สำเร็จ กรุณาลองอีกครั้ง" });
            if (addEmployee?.status === true) {
                setTimeout(() => { onClick(); }, 1500);
                return showMessage({ status: "success", text: "เพิ่มข้อมูลพนักงานสำเร็จ" });
            }
            if (typeof addEmployee.message !== 'string') setMessageError(addEmployee.message);
            return showMessage({ status: "error", text: "เพิ่มข้อมูลพนักงานไม่สำเร็จ กรุณาแก้ไขข้อผิดพลาด" });
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

    if (isLoading) {
        return <div className="mx-3"><Skeleton.Input active={true} size="small" /></div>;
    }

    if (isError) {
        return <ErrPage onClick={handleRefresh} />;
    }
    
    const MyForm = ({ onFinish }: { onFinish: (values: object) => void }): React.JSX.Element => {
        return (
            <Form layout="vertical" onFinish={(values) => { setFormValues(values as employeeSubmit); onFinish(values); }} initialValues={formValues}>
                <div className="grid gap-3 mb-4 grid-cols-1 sml:grid-cols-2">
                    <Col>
                        <Form.Item name="name" label="ชื่อ"
                            rules={[
                                { required: true, message: "กรุณาระบุชื่อ" }
                                , {
                                    pattern: /^[^!@#\$%\^\&*\(\)_\+\{\}\[\]:;<>,\.\?~\\\/-]+$/,
                                    message: "ไม่สามารถระบุอักขระพิเศษได้",
                                },
                                { validator: validateWhitespace },
                            ]}
                        >
                            <Input placeholder="ระบุชื่อ" />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item name="subname" label="นามสกุล"
                            rules={[
                                { required: true, message: "กรุณาระบุนามสกุล" }
                                , {
                                    pattern: /^[^!@#\$%\^\&*\(\)_\+\{\}\[\]:;<>,\.\?~\\\/-]+$/,
                                    message: "ไม่สามารถระบุอักขระพิเศษได้",
                                },
                                { validator: validateWhitespace },
                            ]}
                        >
                            <Input placeholder="ระบุนามสกุล" />
                        </Form.Item>
                    </Col>
                </div>
                <div className="grid gap-3 mb-4 grid-cols-1 sml:grid-cols-2">
                    <Col>
                        <Form.Item name="age" label="อายุ"
                            rules={[
                                { required: true, message: "กรุณาระบุอายุ" },
                                {
                                    pattern: /^\d+(\.\d{0})?$/,
                                    message: "กรุณาระบุตัวเลขเป็นจำนวนเต็ม",
                                },
                                { validator: validateWhitespace },
                            ]}
                        >
                            <Input type="number" step={0.01} placeholder="ระบุอายุ" />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item name="cardId" label="หมายเลขประจำตัวประชาชน"
                            rules={[
                                { required: true, message: "กรุณาระบุหมายเลขประจำตัวประชาชน" },
                                {
                                    pattern: /^\d+(\.\d{0})?$/,
                                    message: "กรุณาระบุตัวเลขเป็นจำนวนเต็ม",
                                },
                                { validator: validateWhitespace },
                            ]}
                        >
                            <Input type="number" step={0.01} placeholder="ระบุหมายเลขประจำตัวประชาชน" />
                        </Form.Item>
                    </Col>
                </div>
                <div className="grid gap-3 mb-4 grid-cols-1 sml:grid-cols-2">
                    <Col>
                        <Form.Item name="userName" label="ผู้ใช้งาน"
                            rules={[
                                { required: true, message: "กรุณาระชื่อผู้ใช้งาน" },
                                {
                                    pattern: /^[^!@#\$%\^\&*\(\)_\+\{\}\[\]:;<>,\.\?~\\\/-]+$/,
                                    message: "ไม่สามารถระบุอักขระพิเศษได้",
                                },
                                {
                                    pattern: /^[a-zA-Z0-9]+$/,
                                    message: "กรุณาระบุตัวเลขหรือตัวอักษรภาษาอังกฤษเท่านั้น",
                                },
                                { validator: validateWhitespace },
                            ]}
                        >
                            <Input placeholder="ระชื่อผู้ใช้งาน" />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item name="passWord" label="รหัสผ่าน"
                            rules={[
                                { required: true, message: "กรุณาระบุรหัสผ่าน" },
                                {
                                    pattern: /^[^!@#\$%\^\&*\(\)_\+\{\}\[\]:;<>,\.\?~\\\/-]+$/,
                                    message: "ไม่สามารถระบุอักขระพิเศษได้",
                                },
                                {
                                    pattern: /^[a-zA-Z0-9]+$/,
                                    message: "กรุณาระบุตัวเลขหรือตัวอักษรภาษาอังกฤษเท่านั้น",
                                },
                                { validator: validateWhitespace },
                            ]}
                        >
                            <Input.Password disabled={statusAction === "update"} placeholder="ระบุรหัสผ่าน" iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
                        </Form.Item>
                    </Col>
                </div>
                <div className="grid gap-3 mb-4 grid-cols-1 sml:grid-cols-2">
                    <Col>
                        <Form.Item name="position" label="ตำแหน่ง"
                            rules={[
                                {
                                    required: true,
                                    message: "กรุณาเลือกตำแหน่ง",
                                },
                            ]}
                        >
                            <Select showSearch placeholder="เลือกตำแหน่ง" optionFilterProp="children" options={data?.position} allowClear
                                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                            />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item name="branch" label="สาขา"
                            rules={[
                                {
                                    required: true,
                                    message: "กรุณาเลือกสาขา",
                                },
                            ]}
                        >
                            <Select showSearch placeholder="เลือกสาขา" optionFilterProp="children" options={data?.branch}                                allowClear
                                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                            />
                        </Form.Item>
                    </Col>
                </div>
                <div className="grid gap-3 mb-4 grid-cols-1 sml:grid-cols-2">
                    <Col>
                        <Form.Item name="role" label="สิทธ์ผู้ใช้งาน"
                            rules={[
                                { required: true, message: "กรุณาเลือกสิทธ์ผู้ใช้งาน", },]} >
                            <Select options={optionRole} placeholder="เลือกสิทธ์ผู้ใช้งาน" />
                        </Form.Item>
                    </Col>
                </div>
                <div className="grid gap-3 mb-4 grid-cols-1 sml:grid-cols-2">
                    <Col>
                        <Form.Item name="status" label="สถานะ"
                            rules={[{ required: true, message: "กรุณาเลือกสถานะ", },]}>
                            <Select options={optionStatus} placeholder="เลือกสถานะ" />
                        </Form.Item>
                    </Col>
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
    )
}

export default EmployeeFrom