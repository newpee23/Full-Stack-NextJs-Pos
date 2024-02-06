import React, { useEffect, useState } from 'react'
import { Form, message } from 'antd';
import StatusFrom from '../UI/select/StatusFrom';
import ProgressBar from '../UI/loading/ProgressBar';
import SaveBtn from '../UI/btn/SaveBtn';
import { useSession } from 'next-auth/react';
import { useAddDataExpensesItem, useSelectOpItemExpenses } from '@/app/api/expensesItem';
import ErrPage from '../ErrPage';
import SelectExpenses from '../UI/select/SelectExpenses';
import RefreshBtn from '../UI/btn/RefreshBtn';
import SkeletonTable from '../UI/loading/SkeletonTable';
import InputFrom from '../UI/InputFrom';
import { Moment } from 'moment';
import { useAppDispatch } from '@/app/store/store';
import { setLoading } from '@/app/store/slices/loadingSlice';
import ErrFrom from '../ErrFrom';
import HeadNameComponent from '../UI/HeadNameComponent';

interface expensesItemSubmit {
  expensesId: number | undefined;
  price: string | undefined;
  orderDate: Moment | undefined;
  branchId: number | undefined;
  status: string;
}

const ExpensesItemFrom = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const addDataExpensesItemMutation = useAddDataExpensesItem();
  const [messageError, setMessageError] = useState<{ message: string }[]>([]);
  const [loadingQuery, setLoadingQuery] = useState<number>(0);
  const { data, isLoading, isError, refetch, remove } = useSelectOpItemExpenses(session?.user.accessToken, session?.user.company_id);
  const [formValues, setFormValues] = useState<expensesItemSubmit>({
    expensesId: undefined,
    orderDate: undefined,
    price: undefined,
    branchId: undefined,
    status: "Active",
  });

  useEffect(() => {
    const loadComponents = () => {
      if (loadingQuery > 0) {
        dispatch(setLoading({ loadingAction: loadingQuery, showLoading: true }));
      }
    };

    loadComponents();
  }, [loadingQuery]);

  const handleRefresh = () => {
    remove();
    return refetch();
  };

  if (isLoading) {
    return <SkeletonTable />;
  }

  if (isError) {
    return <ErrPage onClick={handleRefresh} />;
  }

  const showMessage = ({ status, text }: { status: string; text: string }) => {
    if (status === 'success') {
      messageApi.success(text);
    } else if (status === 'error') {
      messageApi.error(text);
    } else if (status === 'warning') {
      messageApi.warning(text);
    }
  };

  const handleSubmit = async (values: expensesItemSubmit) => {
    try {

      if (!session?.user.branch_id) return showMessage({ status: "error", text: "พบข้อผิดพลาดกรุณาเข้าสู่ระบบใหม่อีกครั้ง" });
      if (!values.expensesId) return showMessage({ status: "error", text: "กรุณาระบุหัวข้อค่าใช้จ่าย" });
      if (!values.orderDate) return showMessage({ status: "error", text: "กรุณาระบุค่าใช้จ่าย" });
      if (!values.price) return showMessage({ status: "error", text: "กรุณาระบุวันที่ใช้จ่าย" });
      setLoadingQuery(0);
      dispatch(setLoading({ loadingAction: 0, showLoading: true }));

      // Insert ExpensesItem
      const addExpensesItem = await addDataExpensesItemMutation.mutateAsync({
        token: session?.user.accessToken,
        expensesItemData: {
          expensesId: values.expensesId,
          orderDate: values.orderDate.toDate(),
          branchId: session?.user.branch_id,
          price: parseInt(values.price, 10),
          status: values.status === "Active" ? "Active" : "InActive",
        },
        setLoadingQuery: setLoadingQuery
      });

      if (addExpensesItem === null) return showMessage({ status: "error", text: "เพิ่มข้อมูลค่าใช้จ่ายไม่สำเร็จ กรุณาลองอีกครั้ง" });
      if (addExpensesItem?.status === true) {
        setFormValues({
          expensesId: undefined,
          orderDate: undefined,
          price: undefined,
          branchId: undefined,
          status: "Active",
        })
        return showMessage({ status: "success", text: "เพิ่มข้อมูลค่าใช้จ่ายสำเร็จ" });
      }
      if (typeof addExpensesItem.message !== 'string') setMessageError(addExpensesItem.message);
      return showMessage({ status: "error", text: "เพิ่มข้อมูลค่าใช้จ่ายไม่สำเร็จ กรุณาแก้ไขข้อผิดพลาด" });
    } catch (error) {
      console.error('Failed to add data:', error);
    }
  };


  return (
    <div>
      <HeadNameComponent name="จัดการข้อมูลบันทึกค่าใช้จ่าย" />
      <div className="p-3 mt-3">
        <Form layout="vertical" onFinish={(values: expensesItemSubmit) => { setFormValues(values); handleSubmit(values) }} initialValues={formValues}>
          {/* หัวข้อค่าใช้จ่าย */}
          <div className="grid gap-3 mb-4 grid-cols-1 sml:grid-cols-2 lgl:grid-cols-4">
            <SelectExpenses option={data} />
            <div className="flex items-center ml-[-0.75rem] mt-3">
              <RefreshBtn label="Refresh" onClick={handleRefresh} />
            </div>
          </div>
          {/* ค่าใช้จ่าย, วันที่ */}
          <div className="grid gap-3 mb-4 grid-cols-1 sml:grid-cols-2 lgl:grid-cols-4">
            <InputFrom label="ค่าใช้จ่าย" name="price" required={true} type="float" />
            <InputFrom label="วันที่ใช้จ่าย" name="orderDate" required={true} type="datePicker" />
          </div>
          {/* สถานะ */}
          <div className="grid gap-3 mb-4 grid-cols-1 sml:grid-cols-2 lgl:grid-cols-4">
            <StatusFrom label="สถานะ" name="status" />
          </div>

          <ProgressBar />
          <SaveBtn label="บันทึกข้อมูล" />
        </Form>
        {contextHolder}
        {messageError.length > 0 && <ErrFrom showError={messageError} />}
      </div>
    </div>
  )
}

export default ExpensesItemFrom