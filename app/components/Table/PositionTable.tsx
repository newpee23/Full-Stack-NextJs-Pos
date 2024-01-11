import { DataTypePosition } from '@/types/columns';
import { ColumnsType } from 'antd/lib/table';
import React from 'react'
import TagStatus from '../UI/TagStatus';
import { Space, Table, message } from 'antd';
import { useSession } from 'next-auth/react';
import { useDataPosition, useDeleteDataPosition } from '@/app/api/position';
import SkeletonTable from '../UI/loading/SkeletonTable';
import ErrPage from '../ErrPage';
import RefreshBtn from '../UI/btn/RefreshBtn';
import PositionFrom from '../ฺFrom/PositionFrom';
import DeleteBtn from '../UI/btn/DeleteBtn';
import HeadNameComponent from '../UI/HeadNameComponent';

const PositionTable = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { data: session } = useSession();
  const { data, isLoading, isError, refetch, remove } = useDataPosition(session?.user.accessToken, session?.user.company_id);
  const deleteDataPosition = useDeleteDataPosition();

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
      const position = await deleteDataPosition.mutateAsync({ token, id });

      if (!position) return showMessage({ status: "error", text: "ไม่สามารถลบข้อมูลได้เนื่องจากมีการนำไปใช้งานแล้ว" });
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

  const columnsPosition: ColumnsType<DataTypePosition> = [
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
      title: "ชื่อตำแหน่ง",
      dataIndex: "name",
      key: "name",
      className: "min-w-[200px]",
    },
    {
      title: "ฐานเงินเดือน",
      dataIndex: "salary",
      key: "salary",
      className: "min-w-[150px] text-center",
      align: "center",
      render: (text) => parseFloat(text).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
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
          <PositionFrom onClick={handleRefresh} editData={record} title="แก้ไขข้อมูลสาขา" statusAction="update" />
          <DeleteBtn name={record.name} onClick={() => handleDeleteClick(record.key)} label="ลบข้อมูล" />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <HeadNameComponent name="จัดการข้อมูลตำแหน่งพนักงาน"/>
      <div className="flex items-center justify-between">
        <PositionFrom onClick={handleRefresh} statusAction="add" title="เพิ่มข้อมูลตำแหน่งพนักงาน" />
        <RefreshBtn label="Refresh Data" onClick={handleRefresh} />
      </div>
      <div className="overflow-x-auto m-3">
        <Table columns={columnsPosition} dataSource={data || []} bordered title={() => "ฐานข้อมูลข้อมูลตำแหน่งพนักงาน"} />
      </div>
      {contextHolder}
    </div>
  )
}

export default PositionTable;