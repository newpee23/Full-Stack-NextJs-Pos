import { Form, Skeleton, message } from 'antd';
import React, { useEffect, useState } from 'react'
import SaveBtn from '../UI/btn/SaveBtn';
import DrawerActionData from '../DrawerActionData';
import { ItemPromotions, fetchItemPromotionInPromotion, optionSelectPromotionItem } from '@/types/fetchData';
import { useSelectOpPromotionItem } from '@/app/api/promotionItem';
import { useSession } from 'next-auth/react';
import ErrPage from '../ErrPage';
import SelectProduct from '../UI/select/SelectProduct';
import ListPromotionItem from '../UI/list/ListPromotionItem';
import InputFrom from '../UI/InputFrom';
import SelectPromotion from '../UI/select/SelectPromotion';
import { dataVerifyItemPromotion } from '@/types/verify';

export interface promotionItem {
  productId: number | undefined;
  promotionId: number | undefined;
  stock: number | undefined;
  status: string;
}

interface Props {
  onClick: () => void;
  editData?: fetchItemPromotionInPromotion;
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
  const { data, isLoading, isError, refetch, remove } = useSelectOpPromotionItem(session?.user.accessToken, session?.user.company_id);
  const [productId, setProductId] = useState<optionSelectPromotionItem[]>([]);
  const [deleteDataItem, setDeleteDataItem] = useState<dataVerifyItemPromotion[]>([]);
  const [formValues, setFormValues] = useState<promotionItemSubmit>({
    productId: undefined,
    promotionId: undefined,
    stock: undefined
  });

  const handleItemSubmit = async (values: { promotionId: number, productId: number, stock: number }) => {

    let promotionId = values.promotionId;
    if(statusAction === "update" && editData && editData.ItemPromotions[0].promotionId){
      promotionId = editData.ItemPromotions[0].promotionId;
    }
   
    if (!promotionId) return showMessage({ status: "error", text: "กรุณาเลือกหัวข้อโปรโมชั่น" });
    if (!values.productId) return showMessage({ status: "error", text: "กรุณาเลือกสินค้า" });

    const selectedPromotion = data?.promotion.find(promotion => promotion.value === promotionId);
    const selectedProduct = data?.product.find(product => product.value === values.productId);

    if (productId.length > 0) {
      const findPromotionId = productId.find(item => item.promotionId !== promotionId);
      if (findPromotionId) return showMessage({ status: "error", text: `กรุณาเลือกหัวข้อโปรโมชั่นเป็น ${productId[0].promotionName} เท่านั้น` });
    }

    if (selectedProduct && selectedPromotion) {
      // ตรวจสอบว่า productId ที่ถูกเลือกมีอยู่ใน state อยู่แล้วหรือไม่
      const isDuplicateProduct = productId?.some(product => product.value === values.productId);
      if (isDuplicateProduct) {
        showMessage({ status: "error", text: "ไม่สามารถเลือกสินค้าซ้ำได้ กรุณาตรวจสอบอีกครั้ง" });
      } else {
        // เพิ่ม productId ที่ถูกเลือกลงใน state
        showMessage({ status: "success", text: "เลือกสินค้าในโปรโมชั่นสำเร็จ" });
        setFormValues({ productId: undefined, promotionId: selectedPromotion.value, stock: undefined });
        setProductId((prevArray) => [...prevArray, { label: selectedProduct.label, value: selectedProduct.value, stock: values.stock, productId: values.productId, promotionId: promotionId, promotionName: selectedPromotion.label ,status: "Active" }]);
      }
    } else {
      showMessage({ status: "error", text: "ไม่พบข้อมูลที่ต้องการ" });
    }
  };

  const handleRemoveProduct = (productIdToRemove: number,item: optionSelectPromotionItem) => {
    const updatedProducts = productId?.filter(product => product.value !== productIdToRemove);
    setProductId(updatedProducts);
    setDeleteDataItem((prevArray) => [
      ...prevArray,
      { promotionId: item.promotionId, productId: item.productId, stock: item.stock, status: item.status }
    ]);
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

  const setProductIdFromEditData = () => {
    if (editData) {
      setProductId([]);
      editData.ItemPromotions.forEach((item) => {
        const selectedPromotion = data?.promotion.find(promotion => promotion.value === item.promotionId);
        const selectedProduct = data?.product.find(product => product.value === item.productId);

        if (selectedPromotion && selectedProduct) {
          setProductId((prevArray) => [...prevArray, { label: selectedProduct.label, value: selectedProduct.value, stock: item.stock, productId: item.productId, promotionId: item.promotionId, promotionName: selectedPromotion.label,  status: item.status}]);
        }
      })
    };
  };

  useEffect(() => {
    return () => setProductIdFromEditData();
  }, [editData]);

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
          {/* เลือกสินค้า,เลือกโปรโมชั่น */}
          <div className="grid gap-3 mb-4 grid-cols-1 sml:grid-cols-2">
            {!editData && (
              <SelectPromotion option={data} />
            )}
            <SelectProduct required={true} option={data} />
          </div>
          <div className="grid gap-3 mb-4 grid-cols-1 sml:grid-cols-2">
            <InputFrom label="จำนวน" name="stock" required={true} type="number" />
            <div className="flex justify-end items-end">
              <div className="mb-[-5px]">
                <SaveBtn label="เพิ่มสินค้า" />
              </div>
            </div>
          </div>
        </Form>

        <ListPromotionItem itemPromoTion={productId} onClick={onClick} handleRemoveProduct={handleRemoveProduct} statusAction={statusAction} deleteDataItem={deleteDataItem}/>
      </>
    );
  };
  return (
    <div>
      <DrawerActionData resetForm={() => { statusAction === "add" ? setProductId([]) : setProductIdFromEditData() }} formContent={<MyForm />} title={title} showError={[]} statusAction={statusAction} />
      {contextHolder}
    </div>
  );
}

export default PromotionItemFrom