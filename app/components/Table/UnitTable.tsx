import { useDataUnits, useDeleteDataUnit } from '@/app/api/unit';
import { Space, Table, message } from 'antd';
import { useSession } from 'next-auth/react';
import React from 'react'
import SkeletonTable from '../UI/loading/SkeletonTable';
import ErrPage from '../ErrPage';
import { ColumnsType } from 'antd/lib/table';
import { fetchUnit } from '@/types/fetchData';
import TagStatus from '../UI/TagStatus';
import DeleteBtn from '../UI/btn/DeleteBtn';
import RefreshBtn from '../UI/btn/RefreshBtn';
import UnitFrom from '../ฺFrom/UnitFrom';
import HeadNameComponent from '../UI/HeadNameComponent';

const UnitTable = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const { data: session } = useSession();
    const { data, isLoading, isError, refetch, remove } = useDataUnits(session?.user.accessToken, session?.user.company_id);
    const deleteDataUnit = useDeleteDataUnit();
  
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
            const unit = await deleteDataUnit.mutateAsync({ token, id });

            if (!unit) return showMessage({ status: "error", text: "ไม่สามารถลบข้อมูลได้เนื่องจากมีการนำไปใช้งานแล้ว" });
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

    const columnsUnit: ColumnsType<fetchUnit> = [
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
            title: "ชื่อหน่วยนับสินค้า",
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
                    <UnitFrom onClick={handleRefresh} editData={record} title="แก้ไขข้อมูลหน่วยนับสินค้า" statusAction="update" />
                    <DeleteBtn name={record.name} onClick={() => handleDeleteClick(record.key)} label="ลบข้อมูล" />
                </Space>
            ),
        },
    ];

    return (
        <div>
        <HeadNameComponent name="จัดการข้อมูลหน่วยนับสินค้า" />
        <div className="flex items-center justify-between">
            <UnitFrom onClick={handleRefresh} statusAction="add" title="เพิ่มข้อมูลหน่วยนับสินค้า" />
            <RefreshBtn label="Refresh Data" onClick={handleRefresh} />
        </div>
        <div className="overflow-x-auto m-3">
            <Table columns={columnsUnit} dataSource={data || []} bordered title={() => "ฐานข้อมูลข้อมูลหน่วยนับสินค้า"} />
        </div>
        {contextHolder}
    </div>
  )
}

export default UnitTable