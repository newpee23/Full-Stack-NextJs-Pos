import { Form, Skeleton, message } from 'antd';
import React, { useState } from 'react'
import SaveBtn from '../UI/btn/SaveBtn';
import DrawerActionData from '../DrawerActionData';
import { fetchItemExpenses, optionSelectPromotionItem } from '@/types/fetchData';
import { useSelectOpPromotionItem } from '@/app/api/promotionItem';
import { useSession } from 'next-auth/react';
import ErrPage from '../ErrPage';
import SelectProduct from '../UI/select/SelectProduct';
import ListPromotionItem from '../UI/list/ListPromotionItem';
import InputFrom from '../UI/InputFrom';

interface promotionItem {
  productId: number | undefined;
  promotionId: number | undefined;
  stock: number | undefined;
  status: string;
}

interface Props {
  onClick: () => void;
  editData?: fetchItemExpenses;
  title: string;
  statusAction: 'add' | 'update';
}

const PromotionItemFrom = ({ onClick, editData, title, statusAction }: Props) => {

  const [messageApi, contextHolder] = message.useMessage();
  const { data: session } = useSession();
  const [messageError, setMessageError] = useState<{ message: string }[]>([]);
  const { data, isLoading, isError, refetch, remove } = useSelectOpPromotionItem(session?.user.accessToken, session?.user.company_id);
  const [productId, setProductId] = useState<optionSelectPromotionItem[]>([]);
  const [formValues, setFormValues] = useState<promotionItem[]>([{
    productId: undefined,
    promotionId: undefined,
    stock: undefined,
    status: "Active",
  }
  ]);

  const handleItemSubmit = async (values: { productId: number, stock: number }) => {
    if (!values.productId) return showMessage({ status: "error", text: "กรุณาเลือกสินค้า" });
    const selectedProduct = data?.product.find(product => product.value === values.productId);
    if (selectedProduct) {
      // ตรวจสอบว่า productId ที่ถูกเลือกมีอยู่ใน state อยู่แล้วหรือไม่
      const isDuplicateProduct = productId?.some(product => product.value === values.productId);
      if (isDuplicateProduct) {
        showMessage({ status: "error", text: "ไม่สามารถเลือกสินค้าซ้ำได้ กรุณาตรวจสอบอีกครั้ง" });
      } else {
        // เพิ่ม productId ที่ถูกเลือกลงใน state
        setProductId((prevArray) => [...prevArray, { label: selectedProduct.label, value: selectedProduct.value, stock: values.stock }]);
      }
    } else {
      showMessage({ status: "error", text: "ไม่พบข้อมูลที่ต้องการ" });
    }
  };


  const handleRemoveProduct = (productIdToRemove: number) => {
    const updatedProducts = productId?.filter(product => product.value !== productIdToRemove);
    setProductId(updatedProducts);
  };

  const showMessage = ({ status, text }: { status: string; text: string }) => {
    if (status === 'success') {
      messageApi.success(text);
    } else if (status === 'error') {
      messageApi.error(text);
    } else if (status === 'warning') {
      messageApi.warning(text);
    }
  };

  const handleRefresh = () => {
    remove();
    return refetch();
  };

  if (isLoading) {
    return <div className="mx-3"><Skeleton.Input active={true} size="small" /></div>;
  }

  if (isError) {
    return <ErrPage onClick={handleRefresh} />;
  }

  const MyForm = (): React.JSX.Element => {
    return (
      <>
        <Form layout="vertical" onFinish={(values: { productId: number, stock: number }) => { handleItemSubmit(values); }} >
          {/* เลือกสินค้า */}
          <div className="grid gap-3 grid-cols-1 sml:grid-cols-2">
            <SelectProduct required={false} option={data} />
            <InputFrom label="จำนวน" name="stock" required={true} type="number" />
          </div>
          <div className="text-right mt-3">
            <SaveBtn label="เพิ่มสินค้า" />
          </div>
        </Form>
        <ListPromotionItem productId={productId} handleRemoveProduct={handleRemoveProduct} />
      </>
    );
  };
  return (
    <div>
      <DrawerActionData resetForm={() => console.log("resetForm")} formContent={<MyForm />} title={title} showError={messageError} statusAction={statusAction} />
      {contextHolder}
    </div>
  );
}

export default PromotionItemFrom