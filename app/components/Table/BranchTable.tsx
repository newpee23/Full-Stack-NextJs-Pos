
import React from "react";
import { Space, Table, message } from "antd";
import { ColumnsType } from "antd/es/table";
import BranchFrom from "../ฺFrom/BranchFrom";

import { useSession } from "next-auth/react";
import SkeletonTable from "../UI/loading/SkeletonTable";
import TagStatus from "../UI/TagStatus";
import ErrPage from "../ErrPage";
import { DataTypeBranch } from "@/types/columns";
import { useDataBranch, useDeleteDataBranch } from "@/app/api/branch";
import DeleteBtn from "../UI/btn/DeleteBtn";
import RefreshBtn from "../UI/btn/RefreshBtn";
import HeadNameComponent from "../UI/HeadNameComponent";

const BranchTable = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { data: session } = useSession();
  const { data, isLoading, isError, refetch, remove } = useDataBranch(session?.user.accessToken, session?.user.company_id);
  const deleteDataBranch = useDeleteDataBranch();

  const handleDeleteClick = async (id: string) => {
    try {
      const token = session?.user.accessToken;
      const branch = await deleteDataBranch.mutateAsync({ token, id });

      if (!branch) return showMessage({ status: "error", text: "ไม่สามารถลบข้อมูลได้เนื่องจากมีการนำไปใช้งานแล้ว" });
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

  const columnsBranch: ColumnsType<DataTypeBranch> = [
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
      title: "ชื่อสาขา",
      dataIndex: "name",
      key: "name",
      className: "min-w-[230px]",
    },
    {
      title: "รหัสใบเสร็จ",
      dataIndex: "codeReceipt",
      key: "codeReceipt",
      className: "min-w-[150px] text-center",
      align: "center",
    },
    {
      title: "ที่อยู่บริษัท",
      dataIndex: "address",
      key: "address",
      className: "min-w-[250px]",
    },
    {
      title: "วันหมดอายุสาขา",
      dataIndex: "expiration",
      key: "expiration",
      className: "min-w-[150px]",
      align: "center"
    },
    {
      title: "เบอร์โทรศัพท์",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "สถานะ",
      key: "status",
      className: "text-center",
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
          <BranchFrom onClick={handleRefresh} editData={record} title="แก้ไขข้อมูลสาขา" statusAction="update" />
          <DeleteBtn name={record.name} onClick={() => handleDeleteClick(record.key)} label="ลบข้อมูล" />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <HeadNameComponent name="จัดการข้อมูลสาขา" />
      <div className="flex items-center justify-between">
        <BranchFrom onClick={handleRefresh} title="เพิ่มข้อมูลสาขา" statusAction="add" />
        <RefreshBtn label="Refresh Data" onClick={handleRefresh} />
      </div>
      <div className="overflow-x-auto m-3">
        <Table columns={columnsBranch} dataSource={data || []} bordered title={() => "ฐานข้อมูลสาขา"} />
      </div>
      {contextHolder}
    </div>
  );
};

export default BranchTable;
