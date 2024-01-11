import { Space, Table, message } from 'antd';
import { useSession } from 'next-auth/react';
import React from 'react'
import RefreshBtn from '../UI/btn/RefreshBtn';
import PromotionItemFrom from '../ฺFrom/PromotionItemFrom';
import { useDataItemPromotion } from '@/app/api/promotionItem';
import SkeletonTable from '../UI/loading/SkeletonTable';
import ErrPage from '../ErrPage';
import { ColumnsType } from 'antd/lib/table';
import { fetchItemPromotionInPromotion } from '@/types/fetchData';
import DeleteBtn from '../UI/btn/DeleteBtn';
import { useDeleteDataPromotion } from '@/app/api/promotion';
import HeadNameComponent from '../UI/HeadNameComponent';

const PromotionItemTable = () => {
    const { data: session } = useSession();
    const [messageApi, contextHolder] = message.useMessage();
    const { data, isLoading, isError, refetch, remove } = useDataItemPromotion(session?.user.accessToken, session?.user.company_id);


    const showMessage = ({ status, text }: { status: string, text: string }) => {
        if (status === 'success') { messageApi.success(text); }
        else if (status === 'error') { messageApi.error(text); }
        else if (status === 'warning') { messageApi.warning(text); }
    };

    const handleDeleteClick = async (id: string) => {
        try {
            // const token = session?.user.accessToken;
            // const promotion = await deleteDataPromotion.mutateAsync({ token, id });

            // if (!promotion) return showMessage({ status: "error", text: "ไม่สามารถลบข้อมูลได้เนื่องจากมีการนำไปใช้งานแล้ว" });
            // return showMessage({ status: "success", text: "ลบข้อมูลสำเร็จ" });
        } catch (error) {
            showMessage({ status: "error", text: "ลบข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง" });
        } finally {
            setTimeout(() => { handleRefresh(); }, 1500);
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

    const columnsItemPromotion: ColumnsType<fetchItemPromotionInPromotion> = [
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
            title: "จำนวนสินค้าในโปรโมชั่น",
            dataIndex: "totalItem",
            className: "min-w-[100px] text-center",
            key: "totalItem",
            render: (text) => parseFloat(text).toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }),
        },
        {
            title: "จัดการข้อมูล",
            key: "action",
            className: "text-center",
            render: (_, record) => (
                <Space size="middle">
                    <PromotionItemFrom onClick={handleRefresh} editData={record} title="แก้ไขข้อมูลสินค้าในโปรโมชั่น" statusAction="update" />
                    {/* <DeleteBtn name={record.name} onClick={() => handleDeleteClick(record.key)} label="ลบข้อมูล" /> */}
                </Space>
            ),
        },
    ];

    return (
        <div>
            <HeadNameComponent name="จัดการข้อมูลสินค้าในโปรโมชั่น" />
            <div className="flex items-center justify-between">
                <PromotionItemFrom onClick={handleRefresh} statusAction="add" title="เพิ่มข้อมูลโปรโมชั่น" />
                <RefreshBtn label="Refresh Data" onClick={handleRefresh} />
            </div>
            <div className="overflow-x-auto m-3">
                <Table columns={columnsItemPromotion} dataSource={data || []} bordered title={() => "ฐานข้อมูลสินค้าในโปรโมชั่น"} />
            </div>
            {contextHolder}
        </div>
    )
}

export default PromotionItemTable