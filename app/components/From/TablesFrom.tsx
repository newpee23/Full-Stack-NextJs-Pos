import { setLoading } from '@/app/store/slices/loadingSlice';
import { useAppDispatch } from '@/app/store/store';
import { Form, Skeleton, message } from 'antd';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import ProgressBar from '../UI/loading/ProgressBar';
import SaveBtn from '../UI/btn/SaveBtn';
import DrawerActionData from '../DrawerActionData';
import { useAddDataTables, useSelectOpTables, useUpdateDataTables } from '@/app/api/table';
import ErrPage from '../ErrPage';
import { fetchTable } from '@/types/fetchData';
import InputFrom from '../UI/InputFrom';
import SelectBranch from '../UI/select/SelectBranch';
import StatusFrom from '../UI/select/StatusFrom';

interface tablesSubmit {
  name: string;
  stoves: string | undefined;
  people: string | undefined;
  expiration: string | undefined;
  branch: number | undefined;
  status: string;
}

interface Props {
  onClick: () => void;
  editData?: fetchTable;
  title: string;
  statusAction: "add" | "update";
};

const TablesFrom = ({ onClick, title, statusAction, editData }: Props) => {

  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const { data, isLoading, isError, refetch, remove } = useSelectOpTables(session?.user.accessToken, session?.user.company_id);
  const addDataTablesMutation = useAddDataTables();
  const updateDataTablesMutation = useUpdateDataTables();
  const [messageError, setMessageError] = useState<{ message: string }[]>([]);
  const [loadingQuery, setLoadingQuery] = useState<number>(0);
  const [formValues, setFormValues] = useState<tablesSubmit>({
    name: "",
    stoves: undefined,
    people: undefined,
    expiration: undefined,
    branch: undefined,
    status: "Active",
  });

  const showMessage = ({ status, text }: { status: string, text: string }) => {
    if (status === "success") { messageApi.success(text); }
    else if (status === "error") { messageApi.error(text); }
    else if (status === "warning") { messageApi.warning(text); }
  };

  const handleSubmit = async (values: object) => {
    const dataFrom = values as tablesSubmit;
    setLoadingQuery(0);
    try {

      if (!session?.user.company_id) return showMessage({ status: "error", text: "พบข้อผิดพลาดกรุณาเข้าสู่ระบบใหม่อีกครั้ง" });
      if (!dataFrom.branch) return showMessage({ status: "error", text: "กรุณาเลือกสาขา" });
      if (!dataFrom.stoves) return showMessage({ status: "error", text: "กรุณาระบุจำนวนเตาต่อโต๊ะ" });
      if (!dataFrom.people) return showMessage({ status: "error", text: "กรุณาระบุจำนวนคนต่อโต๊ะ" });
      if (!dataFrom.expiration) return showMessage({ status: "error", text: "กรุณาระบุเวลาบริการ(นาที)" });
      dispatch(setLoading({ loadingAction: 0, showLoading: true }));
      // Update Tables
      if (editData?.key) {
        const updateTables = await updateDataTablesMutation.mutateAsync({
          token: session?.user.accessToken,
          tablesData: {
            id: editData.key,
            name: dataFrom.name,
            stoves: parseInt(dataFrom.stoves, 10),
            people: parseInt(dataFrom.people, 10),
            expiration: parseInt(dataFrom.expiration, 10),
            branchId: dataFrom.branch,
            companyId: session?.user.company_id,
            status: dataFrom.status === "Active" ? "Active" : "InActive",
          },
          setLoadingQuery: setLoadingQuery
        });

        if (updateTables === null) return showMessage({ status: "error", text: "แก้ไขข้อมูลโต๊ะไม่สำเร็จ กรุณาลองอีกครั้ง" });
        if (updateTables?.status === true) {
          setTimeout(() => { onClick(); }, 1500);
          return showMessage({ status: "success", text: "แก้ไขข้อมูลโต๊ะสำเร็จ" });
        }
        if (typeof updateTables.message !== 'string') setMessageError(updateTables.message);
        return showMessage({ status: "error", text: "แก้ไขข้อมูลโต๊ะไม่สำเร็จ กรุณาแก้ไขข้อผิดพลาด" });
      }
      // Insert Tables
      const addtables = await addDataTablesMutation.mutateAsync({
        token: session?.user.accessToken,
        tablesData: {
          name: dataFrom.name,
          stoves: parseInt(dataFrom.stoves, 10),
          people: parseInt(dataFrom.people, 10),
          expiration: parseInt(dataFrom.expiration, 10),
          branchId: dataFrom.branch,
          companyId: session?.user.company_id,
          status: dataFrom.status === "Active" ? "Active" : "InActive",
        },
        setLoadingQuery: setLoadingQuery
      });

      if (addtables === null) return showMessage({ status: "error", text: "เพิ่มข้อมูลโต๊ะไม่สำเร็จ กรุณาลองอีกครั้ง" });
      if (addtables?.status === true) {
        setTimeout(() => { onClick(); }, 1500);
        return showMessage({ status: "success", text: "เพิ่มข้อมูลโต๊ะสำเร็จ" });
      }
      if (typeof addtables.message !== 'string') setMessageError(addtables.message);
      return showMessage({ status: "error", text: "เพิ่มข้อมูลโต๊ะไม่สำเร็จ กรุณาแก้ไขข้อผิดพลาด" });
    } catch (error: unknown) {
      console.error('Failed to add data:', error);
    }
  };

  const handleRefresh = () => {
    remove();
    return refetch();
  }

  const resetForm = () => {
    if (statusAction === "update") {
      if (editData?.key) {
        setFormValues({
          name: editData.name,
          stoves: editData.stoves.toString(),
          people: editData.people.toString(),
          expiration: editData.expiration.toString(),
          branch: editData.branchId,
          status: editData.status === "Active" ? "Active" : "InActive",
        });
      }
      if (messageError.length > 0) setMessageError([]);
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
      <Form layout="vertical" onFinish={(values) => { setFormValues(values as tablesSubmit); onFinish(values); }} initialValues={formValues}>
        {/* ชื่อโต๊ะประจำสาขา */}
        <div className="grid gap-3 mb-4 grid-cols-1 sml:grid-cols-2">
          <InputFrom label="ชื่อโต๊ะประจำสาขา" name="name" required={true} type="text" />
        </div>
        {/* จำนวนเตาต่อโต๊ะ, ระบุจำนวนเตาต่อโต๊ะ, เวลาบริการ(นาที) */}
        <div className="grid gap-3 grid-cols-1 sml:grid-cols-3">
          <InputFrom label="จำนวนเตาต่อโต๊ะ" name="stoves" required={true} type="number" />
          <InputFrom label="จำนวนคนต่อโต๊ะ" name="people" required={true} type="number" />
          <InputFrom label="เวลาบริการ(นาที)" name="expiration" required={true} type="number" />
        </div>
        {/* สาขา, สถานะ */}
        <div className="grid gap-3 mb-4 grid-cols-1 sml:grid-cols-2 mt-3">
          <SelectBranch data={data} />
          <StatusFrom label="สถานะ" name="status"/>
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

export default TablesFrom