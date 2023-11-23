import { setLoading } from '@/app/store/slices/loadingSlice';
import { useAppDispatch } from '@/app/store/store';
import { fetchProductType } from '@/types/fetchData';
import { Col, Form, Input, Row, Select, message } from 'antd';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { optionStatus, validateWhitespace } from './validate/validate';
import ProgressBar from '../UI/ProgressBar';
import SaveBtn from '../UI/SaveBtn';
import DrawerActionData from '../DrawerActionData';
import { useAddDataProductType, useUpdateDataProductType } from '@/app/api/productType';

type Props = {
  onClick: () => void;
  editData?: fetchProductType;
  title: string;
  statusAction: "add" | "update";
}

interface productTypeSubmit {
  name: string;
  status: string;
}

const ProductTypeFrom = ({ onClick, statusAction, title, editData }: Props) => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const addDataProductTypeMutation = useAddDataProductType();
  const updateDataProductTypeMutation = useUpdateDataProductType();
  const [messageApi, contextHolder] = message.useMessage();
  const [messageError, setMessageError] = useState<{ message: string }[]>([]);
  const [loadingQuery, setLoadingQuery] = useState<number>(0);
  const [formValues, setFormValues] = useState<productTypeSubmit>({
    name: "",
    status: "Active",
  });

  const showMessage = ({ status, text }: { status: string, text: string }) => {
    if (status === "success") { messageApi.success(text); }
    else if (status === "error") { messageApi.error(text); }
    else if (status === "warning") { messageApi.warning(text); }
  };

  const resetForm = () => {
    if (statusAction === "update") {
      if (editData?.key) {
        setFormValues({
          name: editData.name,
          status: editData.status,
        });
      }
      if (messageError.length > 0) setMessageError([]);
    }
  };

  const handleSubmit = async (values: object) => {
    const dataFrom = values as productTypeSubmit;
    setLoadingQuery(0);
    dispatch(setLoading({ loadingAction: 0, showLoading: true }));

    try {
      if (!session?.user.company_id) {
        return showMessage({ status: "error", text: "พบข้อผิดพลาดกรุณาเข้าสู่ระบบใหม่อีกครั้ง" });
      }
      // update ProductType
      if (editData?.key) {
        const updateProductType = await updateDataProductTypeMutation.mutateAsync({
          token: session?.user.accessToken,
          productTypeData: {
            id: parseInt(editData.key, 10),
            name: dataFrom.name,
            companyId: session?.user.company_id,
            status: dataFrom.status === "Active" ? "Active" : "InActive",
          },
          setLoadingQuery: setLoadingQuery
        });

        if (updateProductType === null) return showMessage({ status: "error", text: "แก้ไขข้อมูลประเภทสินค้าไม่สำเร็จ กรุณาลองอีกครั้ง" });
        if (updateProductType?.status === true) {
          setTimeout(() => { onClick(); }, 1500);
          return showMessage({ status: "success", text: "แก้ไขข้อมูลประเภทสินค้าสำเร็จ" });
        }
        if (typeof updateProductType.message !== 'string') setMessageError(updateProductType.message);
        return showMessage({ status: "error", text: "แก้ไขข้อมูลประเภทสินค้าไม่สำเร็จ กรุณาแก้ไขข้อผิดพลาด" });
      }
      // Insert ProductType
      const addProductType = await addDataProductTypeMutation.mutateAsync({
        token: session?.user.accessToken,
        productTypeData: {
          name: dataFrom.name,
          companyId: session?.user.company_id,
          status: dataFrom.status === "Active" ? "Active" : "InActive",
        },
        setLoadingQuery: setLoadingQuery
      });

      if (addProductType === null) return showMessage({ status: "error", text: "เพิ่มข้อมูลประเภทสินค้าไม่สำเร็จ กรุณาลองอีกครั้ง" });
      if (addProductType?.status === true) {
        setTimeout(() => { onClick(); }, 1500);
        return showMessage({ status: "success", text: "เพิ่มข้อมูลประเภทสินค้าสำเร็จ" });
      }
      if (typeof addProductType.message !== 'string') setMessageError(addProductType.message);
      return showMessage({ status: "error", text: "เพิ่มข้อมูลประเภทสินค้า กรุณาแก้ไขข้อผิดพลาด" });
    } catch (error: unknown) {
      console.error('Failed to add data:', error);
    }
  };

  useEffect(() => {
    const loadComponents = () => {
      if (loadingQuery > 0) { dispatch(setLoading({ loadingAction: loadingQuery, showLoading: true })); }
    };

    loadComponents();
  }, [loadingQuery]);

  const MyForm = ({ onFinish }: { onFinish: (values: object) => void }): React.JSX.Element => {
    return (
      <Form layout="vertical" onFinish={(values) => { setFormValues(values as productTypeSubmit); onFinish(values); }} initialValues={formValues}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="name" label="ชื่อประเภทสินค้า"
              rules={[
                { required: true, message: "กรุณาระบุชื่อประเภทสินค้า" }
                , {
                  pattern: /^[^!@#\$%\^\&*\(\)_\+\{\}\[\]:;<>,\.\?~\\\/-]+$/,
                  message: "ไม่สามารถระบุอักขระพิเศษได้",
                },
                { validator: validateWhitespace },
              ]}
            >
              <Input placeholder="ระบุชื่อประเภทสินค้า" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="status" label="สถานะ"
              rules={[
                {
                  required: true,
                  message: "กรุณาเลือกสถานะ",
                },
              ]}
            >
              <Select
                options={optionStatus}
                placeholder="เลือกสถานะ"
              />
            </Form.Item>
          </Col>
        </Row>
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
  )
}

export default ProductTypeFrom;