import { useDataEmployee } from '@/app/api/employee';
import { useSession } from 'next-auth/react';
import React from 'react'
import SkeletonTable from '../UI/SkeletonTable';
import ErrPage from '../ErrPage';
import { Space, Table, message } from 'antd';
import { fetchEmployee } from '@/types/fetchData';
import { ColumnsType } from 'antd/lib/table';
import TagStatus from '../UI/TagStatus';
import RefreshBtn from '../UI/RefreshBtn';
import EmployeeFrom from '../ฺFrom/EmployeeFrom';

type Props = {}

const EmployeeTable = (props: Props) => {

  const [messageApi, contextHolder] = message.useMessage();
  const { data: session } = useSession();
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
      className: "",
    },
    {
      title: "นามสกุล",
      dataIndex: "subname",
      key: "subname",
      className: "",
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
      className: "",
    },
    {
      title: "รหัสผ่าน",
      key: "status",
      className: "text-center min-w-[100px]",
      render: (_, record) => (
        (record.status === "Active") ? <TagStatus color="success" textShow={record.status} /> : <TagStatus color="error" textShow={record.status} />
      ),
    },
    {
      title: "สาขา",
      dataIndex: ["branch", "name"],
      key: "branch",
      className: "",
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
          {/* <PositionFrom onClick={handleRefresh} editData={record}  title="แก้ไขข้อมูลสาขา" statusAction="update"/>
        <DeleteBtn name={record.name} onClick={() => handleDeleteClick(record.key)} label="ลบข้อมูล" /> */}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <EmployeeFrom onClick={handleRefresh} statusAction="add" title="เพิ่มข้อมูลตำแหน่งพนักงาน"/>
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