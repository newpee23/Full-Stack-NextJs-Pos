"use client"
import React from 'react';
import { Button, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import BranchFrom from '../ฺFrom/BranchFrom';
import { useData } from '@/app/api/fetchTableData';
import { useSession } from 'next-auth/react';
import SkeletonTable from '../UI/SkeletonTable';
import TagStatus from '../UI/TagStatus';
import ErrPage from '../ErrPage';

interface DataType {
  key: string;
  name: string;
  codeReceipt: string;
  address: string;
  createdAt: string;
  expiration: string;
  phone: string;
  companyId: number;
  status: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    className: 'w-[300px] min-w-[300px]',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'CodeReceipt',
    dataIndex: 'codeReceipt',
    key: 'codeReceipt',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'createdAt',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
  {
    title: 'expiration',
    dataIndex: 'expiration',
    key: 'expiration',
  },
  {
    title: 'phone',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: 'status',
    key: 'status',
    render: (_, record) => (
      (record.status === "Active") ? <TagStatus color="success" textShow={record.status} /> : <TagStatus color="error" textShow={record.status} />
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <BranchFrom />
      </Space>
    ),
  },
];

const BranchTable = () => {
  const { data: session, status } = useSession();
  const { data, isLoading, isError, refetch } = useData(session?.user.accessToken, session?.user.company_id);

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return <div className="p-3"><SkeletonTable /></div>;
  }

  if (isError) {
    return (
      <div className="text-center m-3">
        <ErrPage />
        <Button className="bg-orange-600 max-w-[150px]" onClick={handleRefresh}>
          <p className="text-white">Refresh Data</p>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <BranchFrom />
        <button onClick={handleRefresh} className="text-orange-500 m-3 py-2 px-3 border rounded-md text-sm drop-shadow-md hover:bg-orange-600 hover:text-white hover:drop-shadow-xl">
          Refresh Data
        </button>
      </div>
      <div className="overflow-x-auto m-3">
        <Table columns={columns} dataSource={data || []} />
      </div>
    </div>
  );
};

export default BranchTable;
