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
import SelectPromotion from '../UI/select/SelectPromotion';

export interface promotionItem {
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

export interface promotionItemSubmit {
  promotionId: number | undefined;
  productId: number | undefined;
  stock: number | undefined;
}

const PromotionItemFrom = ({ onClick, editData, title, statusAction }: Props) => {

  const [messageApi, contextHolder] = message.useMessage();
  const { data: session } = useSession();
  const [messageError, setMessageError] = useState<{ message: string }[]>([]);
  const { data, isLoading, isError, refetch, remove } = useSelectOpPromotionItem(session?.user.accessToken, session?.user.company_id);
  const [productId, setProductId] = useState<optionSelectPromotionItem[]>([]);
  const [formValues, setFormValues] = useState<promotionItemSubmit>({
    productId: undefined,
    promotionId: undefined,
    stock: undefined
  });

  const handleItemSubmit = async (values: { promotionId: number, productId: number, stock: number }) => {
    if (!values.promotionId) return showMessage({ status: "error", text: "กรุณาเลือกหัวข้อโปรโมชั่น" });
    if (!values.productId) return showMessage({ status: "error", text: "กรุณาเลือกสินค้า" });

    const selectedPromotion = data?.promotion.find(promotion => promotion.value === values.promotionId);
    const selectedProduct = data?.product.find(product => product.value === values.productId);
 
    if (productId.length > 0) {
      const findPromotionId = productId.find(item => item.promotionId !== values.promotionId);
      if(findPromotionId) return showMessage({ status: "error", text: `กรุณาเลือกหัวข้อโปรโมชั่นเป็น ${productId[0].promotionName} เท่านั้น` });
    }
    
    if (selectedProduct && selectedPromotion) {
      // ตรวจสอบว่า productId ที่ถูกเลือกมีอยู่ใน state อยู่แล้วหรือไม่
      const isDuplicateProduct = productId?.some(product => product.value === values.productId);
      if (isDuplicateProduct) {
        showMessage({ status: "error", text: "ไม่สามารถเลือกสินค้าซ้ำได้ กรุณาตรวจสอบอีกครั้ง" });
      } else {
        // เพิ่ม productId ที่ถูกเลือกลงใน state
        showMessage({ status: "success", text: "เลือกสินค้าในโปรโมชั่นสำเร็จ" });
        setFormValues({productId: undefined , promotionId: selectedPromotion.value, stock: undefined });
        setProductId((prevArray) => [...prevArray, { label: selectedProduct.label, value: selectedProduct.value, stock: values.stock, productId: values.productId, promotionId: values.promotionId, promotionName: selectedPromotion.label }]);
      }
    } else {
      showMessage({ status: "error", text: "ไม่พบข้อมูลที่ต้องการ" });
    }
  };

  const handleRemoveProduct = (productIdToRemove: number) => {
    const updatedProducts = productId?.filter(product => product.value !== productIdToRemove);
    setProductId(updatedProducts);
  };

  const showMessage = ({ status, text }: { status: "success" | "error" | "warning"; text: string }) => {
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
        <Form layout="vertical" onFinish={(values: { promotionId: number, productId: number, stock: number }) => { handleItemSubmit(values); }} initialValues={formValues}>
          {/* เลือกสินค้า */}
          <div className="grid gap-3 mb-4 grid-cols-1 sml:grid-cols-2">
            <SelectPromotion option={data} />
            <SelectProduct required={true} option={data} />
          </div>
          <div className="grid gap-3 mb-4 grid-cols-1 sml:grid-cols-2">
            <InputFrom label="จำนวน" name="stock" required={true} type="number" />
            <div className="flex justify-end items-center">
              <div>
                <SaveBtn label="เพิ่มสินค้า" />
              </div>
            </div>
          </div>
        </Form>
        <ListPromotionItem itemPromoTion={productId} handleRemoveProduct={handleRemoveProduct} />
      </>
    );
  };
  return (
    <div>
      <DrawerActionData resetForm={() => setProductId([])} formContent={<MyForm />} title={title} showError={messageError} statusAction={statusAction} />
      {contextHolder}
    </div>
  );
}

export default PromotionItemFrom