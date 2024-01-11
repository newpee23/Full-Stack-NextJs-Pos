import { useDataEmployee, useDeleteDataEmployee } from '@/app/api/employee';
import { useSession } from 'next-auth/react';
import React from 'react'
import SkeletonTable from '../UI/loading/SkeletonTable';
import ErrPage from '../ErrPage';
import { Space, Table, message } from 'antd';
import { fetchEmployee } from '@/types/fetchData';
import { ColumnsType } from 'antd/lib/table';
import TagStatus from '../UI/TagStatus';
import RefreshBtn from '../UI/btn/RefreshBtn';
import EmployeeFrom from '../ฺFrom/EmployeeFrom';
import DeleteBtn from '../UI/btn/DeleteBtn';
import HeadNameComponent from '../UI/HeadNameComponent';

const EmployeeTable = () => {

  const [messageApi, contextHolder] = message.useMessage();
  const { data: session } = useSession();
  const deleteDataEmployee = useDeleteDataEmployee();
  const { data, isLoading, isError, refetch, remove } = useDataEmployee(session?.user.accessToken, session?.user.company_id);

  const handleRefresh = async () => {
    remove();
    return await refetch();
  };

  const showMessage = ({ status, text }: { status: string, text: string }) => {
    if (status === 'success') { messageApi.success(text); }
    else if (status === 'error') { messageApi.error(text); }
    else if (status === 'warning') { messageApi.warning(text); }
  };

  const handleDeleteClick = async (id: string) => {
    try {
      const token = session?.user.accessToken;
      const employee = await deleteDataEmployee.mutateAsync({ token, id });

      if (!employee) return showMessage({ status: "error", text: "ไม่สามารถลบข้อมูลได้เนื่องจากมีการนำไปใช้งานแล้ว" });
      return showMessage({ status: "success", text: "ลบข้อมูลสำเร็จ" });
    } catch (error) {
      showMessage({ status: "error", text: "ลบข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง" });
    } finally {
      setTimeout(() => { handleRefresh(); }, 1500);
    }
  };

  if (isLoading) {
    return <SkeletonTable />;
  }

  if (isError) {
    return <ErrPage onClick={handleRefresh} />;
  }

  const columnsPosition: ColumnsType<fetchEmployee> = [
    {
      title: "ลำดับ",
      dataIndex: "index",
      className: "text-center",
      key: "index",
      sorter: {
        compare: (a, b) => a.index - b.index,
        multiple: 1,
      },
    },
    {
      title: "ชื่อ",
      dataIndex: "name",
      key: "name",
      className: "min-w-[180px]",
    },
    {
      title: "นามสกุล",
      dataIndex: "subname",
      key: "subname",
      className: "min-w-[180px]",
    },
    {
      title: "ตำแหน่ง",
      dataIndex: ["position", "name"],
      key: "position",
      className: "text-center",
    },
    {
      title: "ชื่อผู้ใช้",
      dataIndex: "userName",
      key: "userName",
      className: "min-w-[150px]",
    },
    {
      title: "รหัสผ่าน",
      key: "passWord",
      className: "text-center min-w-[100px]",
      render: (_, record) => (
        (record.status === "Active") ? <TagStatus color="success" textShow={record.status} /> : <TagStatus color="error" textShow={record.status} />
      ),
    },
    {
      title: "สาขา",
      dataIndex: ["branch", "name"],
      key: "branch",
      className: "min-w-[150px]",
    },
    {
      title: "สิทธิ์ผู้ใช้งาน",
      dataIndex: "role",
      key: "role",
      className: "text-center",
    },
    {
      title: "สถานะ",
      key: "status",
      className: "text-center min-w-[100px]",
      render: (_, record) => (
        (record.status === "Active") ? <TagStatus color="success" textShow={record.status} /> : <TagStatus color="error" textShow={record.status} />
      ),
    },
    {
      title: "จัดการข้อมูล",
      key: "action",
      className: "text-center",
      render: (_, record) => (
        <Space size="middle">
          <EmployeeFrom onClick={handleRefresh} editData={record} title="แก้ไขข้อมูลสาขา" statusAction="update" />
          <DeleteBtn name={record.name} onClick={() => handleDeleteClick(record.key)} label="ลบข้อมูล" />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <HeadNameComponent name="จัดการข้อมูลพนักงาน" />
      <div className="flex items-center justify-between">
        <EmployeeFrom onClick={handleRefresh} statusAction="add" title="เพิ่มข้อมูลตำแหน่งพนักงาน" />
        <RefreshBtn label="Refresh Data" onClick={handleRefresh} />
      </div>
      <div className="overflow-x-auto m-3">
        <Table columns={columnsPosition} dataSource={data || []} bordered title={() => "ฐานข้อมูลข้อมูลพนักงาน"} />
      </div>
      {contextHolder}
    </div>
  )
}

export default EmployeeTable;