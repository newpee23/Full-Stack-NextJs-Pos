import React, { useState } from 'react';
import { Card, Spin, message } from 'antd';
import TagStatus from '../TagStatus';
import { orderTransactionAdd } from '@/types/fetchData';
import moment from 'moment';
import AddModalTransaction from '../modal/AddModalTransaction';
import { useUpdateDataTransaction } from '@/app/api/transaction';
import DeleteBtn from '../btn/DeleteBtn';
import { useSession } from 'next-auth/react';
import CountdownTime from '../CountdownTime';
import PrintReceipt from '../btn/PrintReceipt';
import { generatePdf } from '@/app/lib/receipt/receiptOpenBill';
import { fetchOrderBillData } from '@/app/api/customerFront/getOrderBill';
import { receiptCloseBill } from '@/app/lib/receipt/receiptCloseBill';
import { fetchDetailReceiptData } from '@/app/api/detailReceipt';

type Props = {
  data: orderTransactionAdd;
  isOpen: boolean;
  onClick: () => void;
};

const CardTransaction = ({ data, isOpen, onClick }: Props) => {

  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
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

  const handleCloseBill = async (id: string, transactionId?: string) => {
    try {
      setLoading(true);
      const updateTransaction = await updateDataTransactionMutation.mutateAsync({
        token: session?.user.accessToken,
        id: id
      });

      if (updateTransaction?.status === true && transactionId) {

        const detailReceipt = await fetchDetailReceiptData(session?.user.accessToken, session?.user.company_id, session?.user.branch_id, transactionId);

        if (!detailReceipt) {
          return showMessage({ status: "error", text: "ไม่พบข้อมูลรายละเอียดบิลขาย" });
        }

        const orderBill = await fetchOrderBillData(session?.user.accessToken, transactionId);
        if (!orderBill) {
          return showMessage({ status: "error", text: "สร้างบิลขายไม่สำเร็จ กรุณาติดต่อเจ้าหน้าที่" });
        }

        receiptCloseBill({ orderBill: orderBill, detailReceipt: detailReceipt });
        setTimeout(() => { onClick(); }, 1000);
        return showMessage({ status: "success", text: "ปิดบิลขายสำเร็จ" });
      }
      return showMessage({ status: "error", text: "ปิดบิลขายไม่สำเร็จ" });
    } catch (error) {
      console.log("error handleCloseBill :", error);
    } finally {
      setLoading(false);
    }
  }

  const countDownTime = () => {
    if (data.transactionOrder?.startOrder) {
      return <div className="text-center">
        <CountdownTime time={data.expiration} startOrder={data.transactionOrder.startOrder} />
      </div>
    }
    return <></>;
  }

  const handleReprint = async () => {
    try {
      setLoading(true);
      const detailReceipt = await fetchDetailReceiptData(session?.user.accessToken, session?.user.company_id, session?.user.branch_id, data.transactionOrder?.id);
      if (!detailReceipt) {
        return showMessage({ status: "error", text: "ไม่พบข้อมูลรายละเอียดบิลขาย" });
      }

      generatePdf({ details: data, page: "tableTransaction", detailReceipt: detailReceipt });
    } catch (error) {
      console.log("error handleReprint :", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Spin tip="Loading..." spinning={loading}>
      <Card key={data.id} title={data.name} extra={countDownTime()} className="bg-slate-50 border border-stone-100 text-sm" hoverable bordered={false}>
        <div className="flex items-center justify-between p-2">
          <p>จำนวนลูกค้า : {data.transactionOrder?.peoples || "0"}/{data.people}</p>
          {isOpen ? (
            <DeleteBtn bill name={data.name} onClick={() => handleCloseBill(data.id, data.transactionOrder?.id)} label="ปิดบิล" />
          ) : (
            <AddModalTransaction data={data} onClick={onClick} setLoading={setLoading} />
          )}
        </div>
        <div className="flex items-center justify-between p-2 mt-[-15px]">
          <p>จำนวนเตา : {data.stoves}</p>
        </div>
        <div className="p-2">
          <p>เวลาเปิดบิล : {data.transactionOrder?.startOrder ? moment(data.transactionOrder?.startOrder?.toString()).format('DD/MM/YYYY HH:mm') : "-"}</p>
        </div>
        <div className="p-2">
          <p>เวลาปิดบิล : {data.transactionOrder?.endOrder ? moment(data.transactionOrder?.endOrder?.toString()).format('DD/MM/YYYY HH:mm') : "-"}</p>
        </div>
        <div className={`flex items-center ${data.transactionOrder?.startOrder ? "justify-between" : "justify-end"} p-2`} style={{ height: "54px" }}>
          {data.transactionOrder?.startOrder && <PrintReceipt label='พิมพ์ใบเปิดโต๊ะ' onClick={() => handleReprint()} />}
          <TagStatus color={isOpen ? "success" : "error"} textShow={isOpen ? "ใช้งาน" : "ไม่ใช้งาน"} />
        </div>
        {contextHolder}
      </Card>
    </Spin>
  );

};

export default CardTransaction;
