
import { exportRpSummaryOfBranchTableToExcel } from "@/app/lib/excel/rpSummaryOfBranchTableToExcel";
import { resultRpSummaryOfBranch } from "@/types/fetchData"
import Table, { ColumnsType } from "antd/lib/table";
import React from "react"
import ExportExcelBtn from "../../UI/btn/ExportExcelBtn";

type Props = {
    data: resultRpSummaryOfBranch[];
    startDate: string;
    endDate: string;
}

const RpSummaryOfBranchTable = ({ data, endDate, startDate }: Props) => {

    const columnsRpSummaryOfBranchTable: ColumnsType<resultRpSummaryOfBranch> = [
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
            dataIndex: "branchName",
            key: "branchName",
            className: "min-w-[200px]",
        },
        {
            title: "จำนวนผู้มาใช้บริการ",
            dataIndex: "toalPeoples",
            key: "toalPeoples",
            className: "min-w-[200px] text-center",
            render: (text) => parseFloat(text).toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }),
        },
        {
            title: "ยอดขายรวมทั้งสาขา",
            dataIndex: "totalPrice",
            key: "totalPrice",
            className: "min-w-[200px] text-center",
            render: (text) => parseFloat(text).toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }),
        },
    ];

    return (
        <div className="mt-5">
            <div className="w-full flex justify-end pr-3">
                <ExportExcelBtn onClick={() => exportRpSummaryOfBranchTableToExcel(data, endDate, startDate)}/>
            </div>
            <div className="overflow-x-auto m-3">
                {/* <Table columns={columnsRpSummaryOfBranchTable} dataSource={data || []} bordered /> */}
                <Table
                    columns={columnsRpSummaryOfBranchTable}
                    dataSource={data.map((item) => ({ ...item, key: item.index }))} // Replace 'uniqueIdentifier' with the actual unique identifier property
                    bordered
                />
            </div>
        </div>
    )
}

export default RpSummaryOfBranchTable;