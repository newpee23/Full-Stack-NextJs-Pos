import { useDataCompanyAll, useDeleteDataCompany } from "@/app/api/company";
import { fetchCompany } from "@/types/fetchData";
import Table, { ColumnsType } from "antd/lib/table";
import { useSession } from "next-auth/react";
import React from "react";
import HeadNameComponent from "../UI/HeadNameComponent";
import TagStatus from "../UI/TagStatus";
import RefreshBtn from "../UI/btn/RefreshBtn";
import SkeletonTable from "../UI/loading/SkeletonTable";
import ErrPage from "../ErrPage";
import { Space, message } from "antd";
import BranchFrom from "../From/BranchFrom";
import DeleteBtn from "../UI/btn/DeleteBtn";
import CompanyFrom from "../From/CompanyFrom";

const CompanyTable = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { data: session } = useSession();
  const deleteDataCompany = useDeleteDataCompany();
  const { data, isLoading, isError, refetch, remove } = useDataCompanyAll(
    session?.user.accessToken
  );

  const showMessage = ({ status, text }: { status: string; text: string }) => {
    if (status === "success") {
      messageApi.success(text);
    } else if (status === "error") {
      messageApi.error(text);
    } else if (status === "warning") {
      messageApi.warning(text);
    }
  };

  const handleDeleteClick = async (id: string) => {
    try {
      const token = session?.user.accessToken;
      const branch = await deleteDataCompany.mutateAsync({ token, id });

      if (!branch)
        return showMessage({
          status: "error",
          text: "ไม่สามารถลบข้อมูลได้เนื่องจากมีการนำไปใช้งานแล้ว",
        });
      return showMessage({ status: "success", text: "ลบข้อมูลสำเร็จ" });
    } catch (error) {
      showMessage({
        status: "error",
        text: "ลบข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง",
      });
    } finally {
      setTimeout(() => {
        handleRefresh();
      }, 1500);
    }
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

  const columnsCompanys: ColumnsType<fetchCompany> = [
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
      title: "ชื่อบริษัท",
      dataIndex: "name",
      key: "name",
      className: "min-w-[230px]",
    },
    {
      title: "เบอร์โทรศัพท์",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "วันที่สร้างข้อมูล",
      dataIndex: "createdAtStr",
      key: "createdAtStr",
      className: "min-w-[150px]",
      align: "center",
    },
    {
      title: "สถานะ",
      key: "status",
      className: "text-center",
      render: (_, record) =>
        record.status === "Active" ? (
          <TagStatus color="success" textShow={record.status} />
        ) : (
          <TagStatus color="error" textShow={record.status} />
        ),
    },
    {
      title: "จัดการข้อมูล",
      key: "action",
      className: "text-center",
      render: (_, record) => (
        <Space size="middle">
          <CompanyFrom onClick={handleRefresh} editData={record} title="แก้ไขข้อมูลบริษัท" statusAction="update" />
          <DeleteBtn
            name={record.name}
            onClick={() => handleDeleteClick(record.key)}
            label="ลบข้อมูล"
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <HeadNameComponent name="จัดการข้อมูลบริษัท" />
      <div className="flex items-center justify-between">
        <CompanyFrom
          onClick={handleRefresh}
          title="เพิ่มข้อมูลบริษัท"
          statusAction="add"
        />
        <RefreshBtn label="Refresh Data" onClick={handleRefresh} />
      </div>
      <div className="overflow-x-auto m-3">
        <Table
          columns={columnsCompanys}
          dataSource={data || []}
          bordered
          title={() => "ฐานข้อมูลบริษัท"}
        />
      </div>
      {contextHolder}
    </div>
  );
};

export default CompanyTable;
