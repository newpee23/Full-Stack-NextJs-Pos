import React from 'react'
import ProductFrom from '../ฺFrom/ProductFrom'
import { Space, Table, message } from 'antd';
import { useSession } from 'next-auth/react';
import { useDataProduct, useDeleteDataProduct } from '@/app/api/product';
import SkeletonTable from '../UI/loading/SkeletonTable';
import ErrPage from '../ErrPage';
import RefreshBtn from '../UI/btn/RefreshBtn';
import { ColumnsType } from 'antd/lib/table';
import { fetchProduct } from '@/types/fetchData';
import TagStatus from '../UI/TagStatus';
import DeleteBtn from '../UI/btn/DeleteBtn';
import HeadNameComponent from '../UI/HeadNameComponent';

const ProductTable = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const { data: session } = useSession();
    const { data, isLoading, isError, refetch, remove } = useDataProduct(session?.user.accessToken, session?.user.company_id);
    const deleteDataProduct = useDeleteDataProduct();

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
            const product = await deleteDataProduct.mutateAsync({ token, id });

            if (!product) return showMessage({ status: "error", text: "ไม่สามารถลบข้อมูลได้เนื่องจากมีการนำไปใช้งานแล้ว" });
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

    const columnsProduct: ColumnsType<fetchProduct> = [
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
            title: "ชื่อสินค้า",
            dataIndex: "name",
            key: "name",
            className: "min-w-[200px]",
        },
        {
            title: "ประเภทสินค้า",
            dataIndex: ["productType", "name"],
            key: "productType",
            className: "min-w-[200px] text-center",
        },
        {
            title: "จำนวนสินค้าในคลัง",
            dataIndex: "stock",
            key: "stock",
            className: "min-w-[200px] text-center",
            render: (text) => parseFloat(text).toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }),
        },
        {
            title: "หน่วยนับ",
            dataIndex: ["unit", "name"],
            key: "unit",
            className: "min-w-[200px] text-center",
        },
        {
            title: "ราคาขาย",
            dataIndex: "price",
            key: "price",
            className: "min-w-[200px] text-center",
            render: (text) => parseFloat(text).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }),
        },
        {
            title: "การขาย",
            key: "statusSail",
            className: "text-center min-w-[100px]",
            render: (_, record) => (
                (record.statusSail === "Active") ? <TagStatus color="success" textShow={record.statusSail} /> : <TagStatus color="error" textShow={record.statusSail} />
            ),
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
                    <ProductFrom onClick={handleRefresh} editData={record} title="แก้ไขข้อมูลสาขา" statusAction="update" />
                    <DeleteBtn name={record.name} onClick={() => handleDeleteClick(record.key)} label="ลบข้อมูล" />
                </Space>
            ),
        },
    ];

    return (
        <div>
            <HeadNameComponent name="จัดการข้อมูลสินค้า" />
            <div className="flex items-center justify-between">
                <ProductFrom onClick={handleRefresh} statusAction="add" title="เพิ่มข้อมูลสินค้า" />
                <RefreshBtn label="Refresh Data" onClick={handleRefresh} />
            </div>
            <div className="overflow-x-auto m-3">
                <Table columns={columnsProduct} dataSource={data || []} bordered title={() => "ฐานข้อมูลข้อมูลสินค้า"} />
            </div>
            {contextHolder}
        </div>
    )
}

export default ProductTable