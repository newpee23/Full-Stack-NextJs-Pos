import { resultRpExpensesOfBranch } from '@/types/fetchData';
import React from 'react'
import ExportExcelBtn from '../../UI/btn/ExportExcelBtn';
import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import TagStatus from '../../UI/TagStatus';
import { exportRpExpensesOfBranchTableToExcel } from '@/app/lib/excel/rpExpensesOfBranchTableToExcel';

type Props = {
    data: resultRpExpensesOfBranch[];
    startDate: string;
    endDate: string;
}

const RpExpensesOfBranchTable = ({ data, endDate, startDate }: Props) => {
    
    const columnsRpExpensesOfBranchTable: ColumnsType<resultRpExpensesOfBranch> = [
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
            dataIndex: ["branchs", "name"],
            key: "branchName",
            className: "min-w-[200px]",
            // render: (branchs) => branchs.name, // เข้าถึงค่า name ใน branchs
        },
        {
            title: "ค่าใช้จ่าย",
            dataIndex: ["expenses", "name"],
            key: "expensesName",
            className: "min-w-[200px]",
            // render: (expenses) => expenses.name, // เข้าถึงค่า expenses ใน branchs
        },
        {
            title: "จำนวน (บาท)",
            dataIndex: "price",
            key: "price",
            className: "min-w-[100px] text-center",
            render: (text) => parseFloat(text).toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }),
        },
        {
            title: "วันเวลาที่ใช้จ่าย",
            dataIndex: "orderShow",
            key: "orderShow",
            className: "min-w-[100px] text-center",
        },
        {
            title: "สถานะ",
            key: "status",
            className: "text-center min-w-[100px]",
            render: (_, record) => (
                (record.status === "Active") ? <TagStatus color="success" textShow={record.status} /> : <TagStatus color="error" textShow={record.status} />
            ),
        },
    ];

    return (
        <div className="mt-5">
            <div className="w-full flex justify-end pr-3">
                <ExportExcelBtn onClick={() => exportRpExpensesOfBranchTableToExcel(data, endDate, startDate)}/> 
            </div>
            <div className="overflow-x-auto m-3">
                {/* <Table columns={columnsRpExpensesOfBranchTable} dataSource={data || []} bordered /> */}
                <Table
                    columns={columnsRpExpensesOfBranchTable}
                    dataSource={data.map((item) => ({ ...item, key: item.index }))} // Replace 'uniqueIdentifier' with the actual unique identifier property
                    bordered
                />
            </div>
        </div>
    )
}

export default RpExpensesOfBranchTable