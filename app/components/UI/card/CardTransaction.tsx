import React from 'react';
import { Card, message } from 'antd';
import TagStatus from '../TagStatus';
import { orderTransactionByBranch } from '@/types/fetchData';
import moment from 'moment';
import AddModalTransaction from '../modal/AddModalTransaction';
import { useUpdateDataTransaction } from '@/app/api/transaction';
import DeleteBtn from '../btn/DeleteBtn';
import { useSession } from 'next-auth/react';
import CountdownTime from '../CountdownTime';

type Props = {
  data: orderTransactionByBranch;
  isOpen: boolean;
  onClick: () => void;
};

const CardTransaction = ({ data, isOpen, onClick }: Props) => {

  const { data: session } = useSession();
  const [messageApi, contextHolder] = message.useMessage();
  const updateDataTransactionMutation = useUpdateDataTransaction();

  const showMessage = ({ status, text }: { status: string; text: string }) => {
    if (status === 'success') {
      messageApi.success(text);
    } else if (status === 'error') {
      messageApi.error(text);
    } else if (status === 'warning') {
      messageApi.warning(text);
    }
  };

  const handleCloseBill = async (id: string) => {
    const updateTransaction = await updateDataTransactionMutation.mutateAsync({
      token: session?.user.accessToken,
      id: id
    });

    if (updateTransaction?.status === true) {
      setTimeout(() => { onClick(); }, 1000);
      return showMessage({ status: "success", text: "ปิดบิลขายสำเร็จ" });
    }
    return showMessage({ status: "error", text: "ปิดบิลขายไม่สำเร็จ กรุณาแก้ไขข้อผิดพลาด" });
  }

  return (
    <Card key={data.id} title={data.name} className="bg-slate-50 border border-stone-100 text-sm" hoverable bordered={false}>

      <div className="text-center">
        <CountdownTime time={data.transactionOrder?.startOrder ? data.expiration : 0} startOrder={data.transactionOrder?.startOrder ? data.transactionOrder.startOrder : new Date()} />
      </div>
      <div className="flex items-center justify-between p-2">
        <p>จำนวนลูกค้า : {data.transactionOrder?.peoples || "0"}/{data.people}</p>
        {isOpen ? (
          <DeleteBtn bill name={data.name} onClick={() => handleCloseBill(data.id)} label="ปิดบิล" />
        ) : (
          <AddModalTransaction data={data} onClick={onClick} />
        )}
      </div>
      <div className="flex items-center justify-between p-2 mt-[-15px]">
        <p>จำนวนเตา : {data.stoves}</p>
      </div>
      <div className="p-2">
        <p>เวลาเปิดบิล : {data.transactionOrder?.startOrder ? moment(data.transactionOrder?.startOrder?.toString()).format('DD/MM/YYYY HH:mm') : "-"}</p>
      </div>
      <div className="p-2">
        <p>เวลาเปิดบิล : {data.transactionOrder?.endOrder ? moment(data.transactionOrder?.endOrder?.toString()).format('DD/MM/YYYY HH:mm') : "-"}</p>
      </div>
      <div className="flex items-center justify-end p-2">
        <TagStatus color={isOpen ? "success" : "error"} textShow={isOpen ? "ใช้งาน" : "ไม่ใช้งาน"} />
      </div>
      {contextHolder}
    </Card>
  );

};

export default CardTransaction;