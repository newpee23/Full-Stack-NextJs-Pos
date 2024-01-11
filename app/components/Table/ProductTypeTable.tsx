import { useDataProductType, useDeleteDataProductType } from '@/app/api/productType';
import { useSession } from 'next-auth/react';
import React from 'react'
import SkeletonTable from '../UI/loading/SkeletonTable';
import ErrPage from '../ErrPage';
import { Space, Table, message } from 'antd';
import { fetchProductType } from '@/types/fetchData';
import { ColumnsType } from 'antd/lib/table';
import TagStatus from '../UI/TagStatus';
import RefreshBtn from '../UI/btn/RefreshBtn';
import ProductTypeFrom from '../ฺFrom/ProductTypeFrom';
import DeleteBtn from '../UI/btn/DeleteBtn';
import HeadNameComponent from '../UI/HeadNameComponent';

const ProductTypeTable = () => {
  const { data: session } = useSession();
  const [messageApi, contextHolder] = message.useMessage();
  const { data, isLoading, isError, refetch, remove } = useDataProductType(session?.user.accessToken, session?.user.company_id);
  const deleteDataProductType = useDeleteDataProductType();

  const handleRefresh = async () => {
    remove();
    return await refetch();
  };

  const handleDeleteClick = async (id: string) => {
    try {
      const token = session?.user.accessToken;
      const productType = await deleteDataProductType.mutateAsync({ token, id });

      if (!productType) return showMessage({ status: "error", text: "ไม่สามารถลบข้อมูลได้เนื่องจากมีการนำไปใช้งานแล้ว" });
      return showMessage({ status: "success", text: "ลบข้อมูลสำเร็จ" });
    } catch (error) {
      showMessage({ status: "error", text: "ลบข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง" });
    } finally {
      setTimeout(() => { handleRefresh(); }, 1500);
    }
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

  const columnsProductType: ColumnsType<fetchProductType> = [
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
      title: "ชื่อประเภทสินค้า",
      dataIndex: "name",
      key: "name",
      className: "min-w-[200px]",
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
          <ProductTypeFrom onClick={handleRefresh} editData={record} title="แก้ไขข้อมูลสาขา" statusAction="update" />
          <DeleteBtn name={record.name} onClick={() => handleDeleteClick(record.key)} label="ลบข้อมูล" />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <HeadNameComponent name="จัดการข้อมูลประเภทสินค้า" />
      <div className="flex items-center justify-between">
        <ProductTypeFrom onClick={handleRefresh} statusAction="add" title="เพิ่มข้อมูลประเภทสินค้า" />
        <RefreshBtn label="Refresh Data" onClick={handleRefresh} />
      </div>
      <div className="overflow-x-auto m-3">
        <Table columns={columnsProductType} dataSource={data || []} bordered title={() => "ฐานข้อมูลประเภทสินค้า"} />
      </div>
      {contextHolder}
    </div>
  )
}

export default ProductTypeTable;