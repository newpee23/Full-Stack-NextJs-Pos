import { DataTypePosition } from '@/types/columns';
import { ColumnsType } from 'antd/lib/table';
import React from 'react'
import TagStatus from '../UI/TagStatus';
import { Space, Table, message } from 'antd';
import { useSession } from 'next-auth/react';
import { useDataPosition } from '@/app/api/position';
import SkeletonTable from '../UI/SkeletonTable';
import ErrPage from '../ErrPage';
import RefreshBtn from '../UI/RefreshBtn';


const PositionTable = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const { data: session } = useSession();
    const { data, isLoading, isError, refetch, remove } = useDataPosition(session?.user.accessToken, session?.user.company_id);
    
    const showMessage = ({ status, text }: { status: string, text: string }) => {
        if (status === 'success') { messageApi.success(text);} 
        else if (status === 'error') { messageApi.error(text);} 
        else if (status === 'warning') { messageApi.warning(text);}
    };

    const handleRefresh = async () => {
        remove();
        return await refetch();
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
              {/* <BranchFrom onClick={handleRefresh} editData={record}  title="แก้ไขข้อมูลสาขา" statusAction="update"/>
              <DeleteBtn name={record.name} onClick={() => handleDeleteClick(record.key)} label="ลบข้อมูล" /> */}
            </Space>
          ),
        },
    ];

  return (
     <div>
      <div className="flex items-center justify-between">
      
        <RefreshBtn label="Refresh Data" onClick={handleRefresh} />
      </div>
      <div className="overflow-x-auto m-3">
        <Table columns={columnsPosition} dataSource={data || []} bordered title={() => "ฐานข้อมูลข้อมูลผู้ใช้งาน"} />
      </div>
      {contextHolder}
    </div>
  )
}

export default PositionTable;