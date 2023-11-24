import { setLoading } from '@/app/store/slices/loadingSlice';
import { useAppDispatch } from '@/app/store/store';
import { Col, Form, Input, Row, Select, message } from 'antd';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import SaveBtn from '../UI/btn/SaveBtn';
import ProgressBar from '../UI/loading/ProgressBar';
import { optionStatus, validateWhitespace } from './validate/validate';
import DrawerActionData from '../DrawerActionData';
import { useAddDataExpenses, useUpdateDataExpenses } from '@/app/api/expenses';
import { fetchExpenses } from '@/types/fetchData';

type Props = {
  onClick: () => void;
  editData?: fetchExpenses;
  title: string;
  statusAction: "add" | "update";
}

interface expensesSubmit {
  name: string;
  status: string;
}

const ExpensesTable = ({ onClick, title, statusAction, editData }: Props) => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const [messageApi, contextHolder] = message.useMessage();
  const addDataExpensesMutation = useAddDataExpenses();
  const updateDataExpensesMutation = useUpdateDataExpenses();
  const [messageError, setMessageError] = useState<{ message: string }[]>([]);
  const [loadingQuery, setLoadingQuery] = useState<number>(0);
  const [formValues, setFormValues] = useState<expensesSubmit>({
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
    const dataFrom = values as expensesSubmit;
    setLoadingQuery(0);
    dispatch(setLoading({ loadingAction: 0, showLoading: true }));

    try {
      if (!session?.user.company_id) {
        return showMessage({ status: "error", text: "พบข้อผิดพลาดกรุณาเข้าสู่ระบบใหม่อีกครั้ง" });
      }
      // updatePosition
      if (editData?.key) {
        const updateExpenses = await updateDataExpensesMutation.mutateAsync({
          token: session?.user.accessToken,
          expensesData: {
            id: parseInt(editData.key, 10),
            name: dataFrom.name,
            companyId: session?.user.company_id,
            status: dataFrom.status === "Active" ? "Active" : "InActive",
          },
          setLoadingQuery: setLoadingQuery
        });

        if (updateExpenses === null) return showMessage({ status: "error", text: "แก้ไขข้อมูลหัวข้อค่าใช้จ่ายไม่สำเร็จ กรุณาลองอีกครั้ง" });
        if (updateExpenses?.status === true) {
          setTimeout(() => { onClick(); }, 1500);
          return showMessage({ status: "success", text: "แก้ไขข้อมูลหัวข้อค่าใช้จ่ายสำเร็จ" });
        }
        if (typeof updateExpenses.message !== 'string') setMessageError(updateExpenses.message);
        return showMessage({ status: "error", text: "แก้ไขข้อมูลหัวข้อค่าใช้จ่ายไม่สำเร็จ กรุณาแก้ไขข้อผิดพลาด" });
      }
      // Insert Expenses
      const addExpenses = await addDataExpensesMutation.mutateAsync({
        token: session?.user.accessToken,
        expensesData: {
          name: dataFrom.name,
          companyId: session?.user.company_id,
          status: dataFrom.status === "Active" ? "Active" : "InActive",
        },
        setLoadingQuery: setLoadingQuery
      });

      if (addExpenses === null) return showMessage({ status: "error", text: "เพิ่มข้อมูลหัวข้อค่าใช้จ่ายไม่สำเร็จ กรุณาลองอีกครั้ง" });
      if (addExpenses?.status === true) {
        setTimeout(() => { onClick(); }, 1500);
        return showMessage({ status: "success", text: "เพิ่มข้อมูลหัวข้อค่าใช้จ่ายสำเร็จ" });
      }
      if (typeof addExpenses.message !== 'string') setMessageError(addExpenses.message);
      return showMessage({ status: "error", text: "เพิ่มข้อมูลหัวข้อค่าใช้จ่าย กรุณาแก้ไขข้อผิดพลาด" });
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
      <Form layout="vertical" onFinish={(values) => { setFormValues(values as expensesSubmit); onFinish(values); }} initialValues={formValues}>
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

export default ExpensesTable