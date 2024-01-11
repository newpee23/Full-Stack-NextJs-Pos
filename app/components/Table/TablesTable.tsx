import { useDataTables, useDeleteDataTables } from '@/app/api/table';
import { Space, Table, message } from 'antd';
import { useSession } from 'next-auth/react';
import React from 'react'
import SkeletonTable from '../UI/loading/SkeletonTable';
import ErrPage from '../ErrPage';
import RefreshBtn from '../UI/btn/RefreshBtn';
import { ColumnsType } from 'antd/lib/table';
import TagStatus from '../UI/TagStatus';
import TablesFrom from '../ฺFrom/TablesFrom';
import DeleteBtn from '../UI/btn/DeleteBtn';
import { fetchTable } from '@/types/fetchData';
import HeadNameComponent from '../UI/HeadNameComponent';

const TablesTable = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { data: session } = useSession();
  const { data, isLoading, isError, refetch, remove } = useDataTables(session?.user.accessToken, session?.user.branch_id);
  const deleteDataTables = useDeleteDataTables();

  const showMessage = ({ status, text }: { status: string, text: string }) => {
    if (status === 'success') { messageApi.success(text); }
    else if (status === 'error') { messageApi.error(text); }
    else if (status === 'warning') { messageApi.warning(text); }
  };

  const handleRefresh = async () => {
    remove();
    return await refetch();
  };

  const handleDeleteClick = async (id: string) => {
    try {
      const token = session?.user.accessToken;
      const branch = await deleteDataTables.mutateAsync({ token, id });

      if (!branch) return showMessage({ status: "error", text: "ไม่สามารถลบข้อมูลได้เนื่องจากมีการนำไปใช้งานแล้ว" });
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

  const columnsTables: ColumnsType<fetchTable> = [

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
      title: "ชื่อโต๊ะ",
      dataIndex: "name",
      key: "name",
      className: "min-w-[200px]",
    },
    {
      title: "เวลาบริการ(นาที)",
      dataIndex: "expiration",
      key: "expiration",
      className: "min-w-[150px] text-center",
      align: "center",
    },
    {
      title: "จำนวนเตาต่อโต๊ะ",
      dataIndex: "stoves",
      key: "stoves",
      className: "min-w-[150px] text-center",
      align: "center",
    },
    {
      title: "จำนวนคนต่อโต๊ะ",
      dataIndex: "people",
      key: "people",
      className: "min-w-[150px] text-center",
      align: "center",
    },
    {
      title: "สาขา",
      dataIndex: ["branch", "name"],
      key: "branch",
      className: "min-w-[150px]",
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
          <TablesFrom onClick={handleRefresh} editData={record} title="แก้ไขข้อมูลสาขา" statusAction="update" />
          <DeleteBtn name={record.name} onClick={() => handleDeleteClick(record.key)} label="ลบข้อมูล" />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <HeadNameComponent name="จัดการข้อมูลโต๊ะ" />
      <div className="flex items-center justify-between">
        <TablesFrom onClick={handleRefresh} statusAction="add" title="เพิ่มข้อมูลโต๊ะ" />
        <RefreshBtn label="Refresh Data" onClick={handleRefresh} />
      </div>
      <div className="overflow-x-auto m-3">
        <Table columns={columnsTables} dataSource={data || []} bordered title={() => "ฐานข้อมูลโต๊ะ"} />
      </div>
      {contextHolder}
    </div>
  )
}

export default TablesTable