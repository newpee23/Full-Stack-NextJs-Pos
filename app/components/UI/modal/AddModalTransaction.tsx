import React, { useState } from 'react';
import { Form, Modal } from 'antd';
import AddBtnBill from '../btn/AddBtnBill';
import { orderTransactionByBranch } from '@/types/fetchData';
import SelectPeople from '../select/SelectPeople';

type Props = {
  data: orderTransactionByBranch;
};

const AddModalTransaction = ({ data }: Props) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const options: { value: string; label: string }[] = [];

  for (let i = 1; i <= data.people; i++) {
    options.push({ value: `${i}`, label: `${i} คน` });
  }

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

  const handleSubmit = (values: {peoples: number}) => {
    console.log('Received values from form:', values.peoples);
    setOpen(false);
    setConfirmLoading(false);
  };

  return (
    <>
      <AddBtnBill label='เปิดบิล' onClick={showModal} />
      <Modal title={`เปิดบิล (${data.name})`} open={open} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
        <Form form={form} layout="vertical" name="userForm" onFinish={(values: {peoples: number}) => { handleSubmit(values); }}>
            <SelectPeople options={options} />
        </Form>
      </Modal>
    </>
  );
};

export default AddModalTransaction;
