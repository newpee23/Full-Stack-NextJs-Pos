import React from 'react';
import { Card } from 'antd';
import TagStatus from '../TagStatus';
import CloseBtnBill from '../btn/CloseBtnBill';
import { orderTransactionByBranch } from '@/types/fetchData';
import moment from 'moment';
import TransactionFrom from '@/app/components/ฺFrom/TransactionFrom';

type Props = {
    data: orderTransactionByBranch;
    isOpen: boolean;
};

const CardTransaction = ({ data, isOpen }: Props) => {
    return (
        <Card key={data.id} title={data.name} className="bg-slate-50 border border-stone-100 text-sm" hoverable bordered={false}>
            <div className="flex items-center justify-between p-2">
                <p>จำนวนลูกค้า : {data.transactionOrder?.peoples || "0"}/{data.people}</p>
                {isOpen ? (
                    <CloseBtnBill onClick={() => console.log("ssss")} label="ปิดบิล" />
                ) : (
                    <TransactionFrom id={data.id} tableName={data.name} />
                )}
            </div>
            <div className="flex items-center justify-between p-2">
                <p>จำนวนเตา : {data.stoves}</p>
            </div>
            <div className="p-2">
                <p>เวลาเปิดบิล : {moment(data.transactionOrder?.startOrder?.toString()).format('DD/MM/YYYY HH:mm') || "-"}</p>
            </div>
            <div className="flex items-center justify-between p-2">
                <p>ยอดปัจจุบัน: </p>
                <TagStatus color={isOpen ? "success" : "error"} textShow={isOpen ? "ใช้งาน" : "ไม่ใช้งาน"} />
            </div>
        </Card>
    );

};

export default CardTransaction;
