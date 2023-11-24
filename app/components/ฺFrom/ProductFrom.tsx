import { setLoading } from '@/app/store/slices/loadingSlice';
import { useAppDispatch } from '@/app/store/store';
import { fetchProduct } from '@/types/fetchData';
import { Col, Form, Upload, Select, message, Button } from 'antd';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import ProgressBar from '../UI/ProgressBar';
import SaveBtn from '../UI/SaveBtn';
import { optionStatus, validateWhitespace } from './validate/validate';
import DrawerActionData from '../DrawerActionData';
import { PlusOutlined } from '@ant-design/icons';
import UploadImg from '../UI/UploadImg';

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

  const handleRefresh = () => {};

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
        <div className="grid gap-3 grid-cols-1 sml:grid-cols-2">
          <Col>
            {/* เลือกรูปภาพ */}
            <UploadImg/>
          </Col>
        </div>
        <div className="grid gap-3 grid-cols-1 sml:grid-cols-2">
          <Col>
            <Form.Item
              name="status"
              label="สถานะ"
              rules={[{ required: true, message: 'กรุณาเลือกสถานะ' }]}
            >
              <Select options={optionStatus} placeholder="เลือกสถานะ" />
            </Form.Item>
          </Col>
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
