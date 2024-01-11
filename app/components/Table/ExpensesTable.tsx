import { useDataExpenses, useDeleteDataExpenses } from '@/app/api/expenses';
import { Space, Table, message } from 'antd';
import { useSession } from 'next-auth/react';
import React from 'react'
import SkeletonTable from '../UI/loading/SkeletonTable';
import ErrPage from '../ErrPage';
import { ColumnsType } from 'antd/lib/table';
import { fetchExpenses } from '@/types/fetchData';
import TagStatus from '../UI/TagStatus';
import RefreshBtn from '../UI/btn/RefreshBtn';
import ExpensesFrom from '../ฺFrom/ExpensesFrom';
import DeleteBtn from '../UI/btn/DeleteBtn';
import HeadNameComponent from '../UI/HeadNameComponent';

const ExpensesTable = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const { data: session } = useSession();
    const { data, isLoading, isError, refetch, remove } = useDataExpenses(session?.user.accessToken, session?.user.company_id);
    const deleteDataExpenses = useDeleteDataExpenses();

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
            const expenses = await deleteDataExpenses.mutateAsync({ token, id });

            if (!expenses) return showMessage({ status: "error", text: "ไม่สามารถลบข้อมูลได้เนื่องจากมีการนำไปใช้งานแล้ว" });
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

    const columnsExpenses: ColumnsType<fetchExpenses> = [
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
            title: "ชื่อหัวข้อค่าใช้จ่าย",
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
                    <ExpensesFrom onClick={handleRefresh} editData={record} title="แก้ไขข้อมูลหัวข้อค่าใช้จ่าย" statusAction="update" />
                    <DeleteBtn name={record.name} onClick={() => handleDeleteClick(record.key)} label="ลบข้อมูล" />
                </Space>
            ),
        },
    ];

    return (
        <div>
            <HeadNameComponent name="จัดการข้อมูลหัวข้อค่าใช้จ่าย"/>
            <div className="flex items-center justify-between">
                <ExpensesFrom onClick={handleRefresh} statusAction="add" title="เพิ่มข้อมูลหัวข้อค่าใช้จ่าย" />
                <RefreshBtn label="Refresh Data" onClick={handleRefresh} />
            </div>
            <div className="overflow-x-auto m-3">
                <Table columns={columnsExpenses} dataSource={data || []} bordered title={() => "ฐานข้อมูลข้อมูลหัวข้อค่าใช้จ่าย"} />
            </div>
            {contextHolder}
        </div>
    )
}

export default ExpensesTable