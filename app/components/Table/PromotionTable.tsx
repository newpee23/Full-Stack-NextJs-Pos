import React from 'react'
import RefreshBtn from '../UI/btn/RefreshBtn';
import PromotionFrom from '../ฺFrom/PromotionFrom';
import { useSession } from 'next-auth/react';
import { Space, Table, message } from 'antd';
import { useDataPromotion, useDeleteDataPromotion } from '@/app/api/promotion';
import SkeletonTable from '../UI/loading/SkeletonTable';
import ErrPage from '../ErrPage';
import { fetchPromotion } from '@/types/fetchData';
import { ColumnsType } from 'antd/lib/table';
import TagStatus from '../UI/TagStatus';
import DeleteBtn from '../UI/btn/DeleteBtn';
import HeadNameComponent from '../UI/HeadNameComponent';


const PromotionTable = () => {

    const { data: session } = useSession();
    const [messageApi, contextHolder] = message.useMessage();
    const { data, isLoading, isError, refetch, remove } = useDataPromotion(session?.user.accessToken, session?.user.company_id);
    const deleteDataPromotion = useDeleteDataPromotion();

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
            const promotion = await deleteDataPromotion.mutateAsync({ token, id });

            if (!promotion) return showMessage({ status: "error", text: "ไม่สามารถลบข้อมูลได้เนื่องจากมีการนำไปใช้งานแล้ว" });
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

    const columnsPromotion: ColumnsType<fetchPromotion> = [
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
            title: "ชื่อโปรโมชั่น",
            dataIndex: "name",
            className: "min-w-[300px]",
            key: "name",
        },
        {
            title: "วันที่เริ่มโปรโมชั่น",
            dataIndex: "startDate",
            className: "min-w-[180px] text-center",
            key: "startDate",
        },
        {
            title: "วันที่หมดโปรโมชั่น",
            dataIndex: "endDate",
            className: "min-w-[180px] text-center",
            key: "endDate",
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
                    <PromotionFrom onClick={handleRefresh} editData={record} title="แก้ไขข้อมูลหัวข้อโปรโมชั่น" statusAction="update" />
                    <DeleteBtn name={record.name} onClick={() => handleDeleteClick(record.key)} label="ลบข้อมูล" />
                </Space>
            ),
        },
    ];


    return (
        <div>
            <HeadNameComponent name="จัดการข้อมูลหัวข้อโปรโมชั่น" />
            <div className="flex items-center justify-between">
                <PromotionFrom onClick={handleRefresh} statusAction="add" title="เพิ่มข้อมูลหัวข้อโปรโมชั่น" />
                <RefreshBtn label="Refresh Data" onClick={handleRefresh} />
            </div>
            <div className="overflow-x-auto m-3">
                <Table columns={columnsPromotion} dataSource={data || []} bordered title={() => "ฐานข้อมูลหัวข้อโปรโมชั่น"} />
            </div>
            {contextHolder}
        </div>
    )
}

export default PromotionTable