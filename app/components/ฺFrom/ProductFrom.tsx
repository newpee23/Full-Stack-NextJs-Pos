import { setLoading } from '@/app/store/slices/loadingSlice';
import { useAppDispatch } from '@/app/store/store';
import { fetchProduct } from '@/types/fetchData';
import { Col, Form, Upload, Select, message, Button } from 'antd';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import ProgressBar from '../UI/loading/ProgressBar';
import SaveBtn from '../UI/btn/SaveBtn';
import { optionStatus, validateWhitespace } from './validate/validate';
import DrawerActionData from '../DrawerActionData';
import { PlusOutlined } from '@ant-design/icons';
import UploadImg from '../UI/UploadImg';
import StatusFrom from '../UI/select/StatusFrom';
import InputFrom from '../UI/InputFrom';

interface Props {
  onClick: () => void;
  editData?: fetchProduct;
  title: string;
  statusAction: 'add' | 'update';
}

const ProductFrom = ({ onClick, editData, title, statusAction }: Props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const [messageError, setMessageError] = useState<{ message: string }[]>([]);
  const [loadingQuery, setLoadingQuery] = useState<number>(0);

  const showMessage = ({ status, text }: { status: string; text: string }) => {
    if (status === 'success') {
      messageApi.success(text);
    } else if (status === 'error') {
      messageApi.error(text);
    } else if (status === 'warning') {
      messageApi.warning(text);
    }
  };

  const handleSubmit = async (values: object) => {
    console.log('handleSubmit', values);
    // Perform your form submission logic here
  };

  const handleRefresh = () => { };

  const resetForm = () => {
    console.log('resetForm');
    // Reset your form values here
  };

  useEffect(() => {
    const loadComponents = () => {
      if (loadingQuery > 0) {
        dispatch(setLoading({ loadingAction: loadingQuery, showLoading: true }));
      }
    };

    loadComponents();
  }, [loadingQuery]);

  const MyForm = ({ onFinish }: { onFinish: (values: object) => void }): React.JSX.Element => {
    return (
      <Form layout="vertical" onFinish={(values) => onFinish(values)}>
        {/* เลือกรูปภาพ */}
        <div className="grid gap-3 grid-cols-1 sml:grid-cols-1">
          <UploadImg label="เพิ่มรูปภาพสินค้า" name="productImg" />
        </div>
        {/* ชื่อสินค้า */}
        <div className="grid gap-3 grid-cols-1 sml:grid-cols-2">
          <InputFrom label="ชื่อสินค้า" name="name" required={true} type="text" />
        </div>
        {/* สถานะ */}
        <div className="grid gap-3 grid-cols-1 sml:grid-cols-2">
          <StatusFrom label="สถานะ" name="status" />
        </div>

        <ProgressBar />
        <SaveBtn label="บันทึกข้อมูล" />
      </Form>
    );
  };

  return (
    <div>
      {contextHolder}
      <DrawerActionData resetForm={resetForm} formContent={<MyForm onFinish={handleSubmit} />} title={title} showError={messageError} statusAction={statusAction} />
    </div>
  );
};

export default ProductFrom;
