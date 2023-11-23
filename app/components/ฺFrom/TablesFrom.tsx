import { setLoading } from '@/app/store/slices/loadingSlice';
import { useAppDispatch } from '@/app/store/store';
import { Col, Form, Input, Select } from 'antd';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { optionStatus, validateWhitespace } from './validate/validate';
import ProgressBar from '../UI/ProgressBar';
import SaveBtn from '../UI/SaveBtn';
import DrawerActionData from '../DrawerActionData';
import { useSelectOpTables } from '@/app/api/table';

interface Props {
  onClick: () => void;
  // editData?: fetchEmployee;
  title: string;
  statusAction: "add" | "update";
};

const TablesFrom = ({ onClick, title, statusAction }: Props) => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const { data, isLoading, isError, refetch, remove } = useSelectOpTables(session?.user.accessToken, session?.user.company_id);
  const [messageError, setMessageError] = useState<{ message: string }[]>([]);
  const [loadingQuery, setLoadingQuery] = useState<number>(0);

  const handleSubmit = async (values: object) => {
    console.log(values)
  };

  const resetForm = () => {

  };

  useEffect(() => {
    const loadComponents = () => {
      if (loadingQuery > 0) { dispatch(setLoading({ loadingAction: loadingQuery, showLoading: true })); }
    };

    loadComponents();
  }, [loadingQuery]);

  const MyForm = ({ onFinish }: { onFinish: (values: object) => void }): React.JSX.Element => {
    return (
      <Form layout="vertical" onFinish={(values) => { onFinish(values); }}>
        <div className="grid gap-3 grid-cols-1 sml:grid-cols-2">
          <Col>
            <Form.Item name="name" label="ชื่อโต๊ะประจำสาขา"
              rules={[
                { required: true, message: "กรุณาระบุชื่อโต๊ะประจำสาขา" }
                , {
                  pattern: /^[^!@#\$%\^\&*\(\)_\+\{\}\[\]:;<>,\.\?~\\\/-]+$/,
                  message: "ไม่สามารถระบุอักขระพิเศษได้",
                },
                { validator: validateWhitespace },
              ]}
            >
              <Input placeholder="ระบุชื่อโต๊ะประจำสาขา" />
            </Form.Item>
          </Col>
        </div>
        <div className="grid gap-3 grid-cols-1 sml:grid-cols-3">
        <Col>
            <Form.Item name="stoves" label="จำนวนเตาต่อโต๊ะ"
              rules={[
                { required: true, message: "กรุณาระบุจำนวนเตาต่อโต๊ะ" },
                {
                  pattern: /^\d+(\.\d{0})?$/,
                  message: "กรุณาระบุตัวเลขเป็นจำนวนเต็ม",
                },
                { validator: validateWhitespace },
              ]}
            >
              <Input placeholder="ระบุจำนวนเตาต่อโต๊ะ" />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="people" label="จำนวนคนต่อโต๊ะ"
              rules={[
                { required: true, message: "กรุณาระบุจำนวนคนต่อโต๊ะ" },
                {
                  pattern: /^\d+(\.\d{0})?$/,
                  message: "กรุณาระบุตัวเลขเป็นจำนวนเต็ม",
                },
                { validator: validateWhitespace },
              ]}
            >
              <Input placeholder="ระบุจำนวนคนต่อโต๊ะ" />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="expiration" label="เวลาบริการ(นาที)"
              rules={[
                { required: true, message: "กรุณาระบุเวลาบริการ(นาที)" },
                {
                  pattern: /^\d+(\.\d{0})?$/,
                  message: "กรุณาระบุตัวเลขเป็นจำนวนเต็ม",
                },
                { validator: validateWhitespace },
              ]}
            >
              <Input placeholder="ระบุเวลาบริการ(นาที)" />
            </Form.Item>
          </Col>
         
        </div>
        <div className="grid gap-3 grid-cols-1 sml:grid-cols-2">
          <Col>
            <Form.Item name="branch" label="สาขา"
              rules={[
                {
                  required: true,
                  message: "กรุณาเลือกสาขา",
                },
              ]}
            >
              <Select showSearch placeholder="เลือกสาขา" optionFilterProp="children" options={data?.branch} allowClear
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="status" label="สถานะ"
              rules={[{ required: true, message: "กรุณาเลือกสถานะ", },]}>
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
      <DrawerActionData resetForm={resetForm} formContent={<MyForm onFinish={handleSubmit} />} title={title} showError={messageError} statusAction={statusAction} />
    </div>
  )
}

export default TablesFrom