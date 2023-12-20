import React, { useState } from 'react';
import { Form, Modal, message } from 'antd';
import AddBtnBill from '../btn/AddBtnBill';
import { orderTransactionByBranch } from '@/types/fetchData';
import SelectPeople from '../select/SelectPeople';
import { useAddDataTransaction } from '@/app/api/transaction';
import { useSession } from 'next-auth/react';
import { generatePdf } from '@/app/lib/receipt/receiptOpenBill';

type Props = {
  data: orderTransactionByBranch;
  onClick: () => void;
};

const AddModalTransaction = ({ data , onClick }: Props) => {

  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const addDataTransactionMutation = useAddDataTransaction();
  const [messageApi, contextHolder] = message.useMessage();
  const options: { value: string; label: string }[] = [];

  for (let i = 1; i <= data.people; i++) {
    options.push({ value: `${i}`, label: `${i} คน` });
  }

  const showMessage = ({ status, text }: { status: string, text: string }) => {
    if (status === "success") { messageApi.success(text); }
    else if (status === "error") { messageApi.error(text); }
    else if (status === "warning") { messageApi.warning(text); }
  };


  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    try {
      await form.validateFields();
      form.submit();
      setConfirmLoading(true);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
    setConfirmLoading(false);
  };

  const handleSubmit = async (values: { peoples: string }) => {
    if (!session?.user.branch_id || !session?.user.id) {
      return showMessage({ status: "error", text: "พบข้อผิดพลาดกรุณาเข้าสู่ระบบใหม่อีกครั้ง" });
    }
    const addTransaction = await addDataTransactionMutation.mutateAsync({
      token: session?.user.accessToken,
      transactionData: {
        tableId: data.id,
        peoples: parseInt(values.peoples, 10),
        expiration: data.expiration,
        branchId: session?.user.branch_id,
        employeeId: parseInt(session?.user.id, 10),
      },
    });

    if (addTransaction?.status === true) {
      generatePdf({ details: addTransaction.transactionItem, page: "modalAdd" });
      setTimeout(() => { onClick(); }, 1000);
      setOpen(false);
      setConfirmLoading(false);
      return showMessage({ status: "success", text: "เปิดบิลสำเร็จ" });
    } else {
      return showMessage({ status: "error", text: "เปิดบิลไม่สำเร็จ กรุณาลองอีกครั้ง" });
    }
  }

  return (
    <>
      <AddBtnBill label='เปิดบิล' onClick={showModal} />
      <Modal title={`เปิดบิล (${data.name})`} open={open} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
        <Form form={form} layout="vertical" name="userForm" onFinish={(values: { peoples: string }) => { handleSubmit(values); }}>
          <SelectPeople options={options} />
        </Form>
      </Modal>
      {contextHolder}
    </>
  );
};

export default AddModalTransaction;
