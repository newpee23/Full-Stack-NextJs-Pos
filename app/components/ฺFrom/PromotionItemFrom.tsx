import { Form, Skeleton } from 'antd';
import React, { useState } from 'react'
import InputFrom from '../UI/InputFrom';
import StatusFrom from '../UI/select/StatusFrom';
import ProgressBar from '../UI/loading/ProgressBar';
import SaveBtn from '../UI/btn/SaveBtn';
import DrawerActionData from '../DrawerActionData';
import { fetchItemExpenses } from '@/types/fetchData';
import { useSelectOpPromotionItem } from '@/app/api/promotionItem';
import { useSession } from 'next-auth/react';
import SkeletonTable from '../UI/loading/SkeletonTable';
import ErrPage from '../ErrPage';
import SelectPromotion from '../UI/select/SelectPromotion';
import SelectProduct from '../UI/select/SelectProduct';

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

  const { data: session } = useSession();
  const [messageError, setMessageError] = useState<{ message: string }[]>([]);
  const { data, isLoading, isError, refetch, remove } = useSelectOpPromotionItem(session?.user.accessToken, session?.user.company_id);
  const [productId, setProductId] = useState<string[]>([]);
  const [formValues, setFormValues] = useState<promotionItem[]>([{
    productId: undefined,
    promotionId: undefined,
    stock: undefined,
    status: "Active",
  }
  ]);

  const handleSubmit = async (values: object) => {
    console.log(values)
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

  const MyForm = ({ onFinish }: { onFinish: (values: object) => void }): React.JSX.Element => {
    return (
      <>
      <Form layout="vertical" onFinish={(values) => { onFinish(values); }} >
        {/* หัวข้อโปรโมชั่น */}
        <div className="grid gap-3 grid-cols-1 sml:grid-cols-2">
          <SelectPromotion option={data} />
          <SelectProduct option={data} />
        </div>
        <div className="flex justify-end">
          <SaveBtn label="เพิ่มสินค้าในโปรโมชั่น" />
        </div>
      </Form>
        <Form layout="vertical" onFinish={(values) => { onFinish(values); }} >
        {/* หัวข้อโปรโมชั่น */}
        <div className="grid gap-3 grid-cols-1 sml:grid-cols-2">
          <SelectPromotion option={data} />
          <SelectProduct option={data} />
        </div>
        <div className="flex justify-end">
          <SaveBtn label="เพิ่มสินค้าในโปรโมชั่น" />
        </div>
      </Form>
      </>
    );
  };
  return (
    <div>
      <DrawerActionData resetForm={() => console.log("resetForm")} formContent={<MyForm onFinish={handleSubmit} />} title={title} showError={messageError} statusAction={statusAction} />
    </div>
  );
}

export default PromotionItemFrom