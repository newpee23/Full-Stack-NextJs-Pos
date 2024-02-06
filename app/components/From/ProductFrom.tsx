import { setLoading } from '@/app/store/slices/loadingSlice';
import { useAppDispatch } from '@/app/store/store';
import { fetchProduct } from '@/types/fetchData';
import { Form, message, Skeleton } from 'antd';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import ProgressBar from '../UI/loading/ProgressBar';
import SaveBtn from '../UI/btn/SaveBtn';
import DrawerActionData from '../DrawerActionData';
import StatusFrom from '../UI/select/StatusFrom';
import InputFrom from '../UI/InputFrom';
import { useAddDataProduct, useSelectOpProduct, useUpdateDataProduct } from '@/app/api/product';
import ErrPage from '../ErrPage';
import SelectProductType from '../UI/select/SelectProductType';
import SelectUnit from '../UI/select/SelectUnit';
import { RcFile } from 'antd/lib/upload';
import UploadAnt from '../UI/upload/UploadProduct';

interface Props {
  onClick: () => void;
  editData?: fetchProduct;
  title: string;
  statusAction: 'add' | 'update';
}

export interface productSubmit {
  img: {
    file: File
  } | undefined;
  imageUrl: string | undefined;
  name: string;
  cost: string | undefined;
  price: string | undefined;
  stock: string | undefined;
  unitId: string | undefined;
  productTypeId: string | undefined;
  companyId: number | undefined;
  status: string;
  statusSail: string;
}

const ProductFrom = ({ onClick, editData, title, statusAction }: Props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const { data, isLoading, isError, refetch, remove } = useSelectOpProduct(session?.user.accessToken, session?.user.company_id);
  const addDataProductMutation = useAddDataProduct();
  const updateDataProductMutation = useUpdateDataProduct();
  const [messageError, setMessageError] = useState<{ message: string }[]>([]);
  const [loadingQuery, setLoadingQuery] = useState<number>(0);
  const [formValues, setFormValues] = useState<productSubmit>({
    img: undefined,
    imageUrl: undefined,
    name: "",
    cost: undefined,
    price: undefined,
    stock: undefined,
    unitId: undefined,
    productTypeId: undefined,
    companyId: undefined,
    status: "Active",
    statusSail: "Active"
  });

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
    setLoadingQuery(0);
    let dataFrom = values as productSubmit;
    try {
      if (!session?.user.company_id) return showMessage({ status: "error", text: "พบข้อผิดพลาดกรุณาเข้าสู่ระบบใหม่อีกครั้ง" });
      if (!dataFrom.cost) return showMessage({ status: "error", text: "กรุณาระบุต้นทุนสินค้า" });
      if (!dataFrom.price) return showMessage({ status: "error", text: "กรุณาระบุราคาขายสินค้า" });
      if (!dataFrom.stock) return showMessage({ status: "error", text: "กรุณาระบุจำนวนสต็อคสินค้า" });
      if (!dataFrom.productTypeId) return showMessage({ status: "error", text: "กรุณาเลือกประเภทสินค้า" });
      if (!dataFrom.unitId) return showMessage({ status: "error", text: "กรุณาเลือกหน่วยนับสินค้า" });
      dispatch(setLoading({ loadingAction: 0, showLoading: true }));
      // Update Tables
      if (editData?.key) {

        const updateProduct = await updateDataProductMutation.mutateAsync({
          token: session?.user.accessToken,
          productData: {
            id: parseInt(editData.key, 10),
            img: dataFrom.img ? dataFrom.img : undefined,
            imageUrl: dataFrom.imageUrl,
            name: dataFrom.name,
            cost: parseInt(dataFrom.cost, 10),
            price: parseInt(dataFrom.price, 10),
            stock: parseInt(dataFrom.stock, 10),
            unitId: parseInt(dataFrom.unitId, 10),
            productTypeId: parseInt(dataFrom.productTypeId, 10),
            companyId: session?.user.company_id,
            status: dataFrom.status === "Active" ? "Active" : "InActive",
            statusSail: dataFrom.statusSail === "Active" ? "Active" : "InActive",
          },
          setLoadingQuery: setLoadingQuery
        });

        if (updateProduct === null) return showMessage({ status: "error", text: "แก้ไขข้อมูลสินค้าไม่สำเร็จ กรุณาลองอีกครั้ง" });
        if (updateProduct?.status === true) {
          setTimeout(() => { onClick(); }, 1500);
          return showMessage({ status: "success", text: "แก้ไขข้อมูลสินค้าสำเร็จ" });
        }
        if (typeof updateProduct.message !== 'string') setMessageError(updateProduct.message);
        return showMessage({ status: "error", text: "แก้ไขข้อมูลสินค้าไม่สำเร็จ กรุณาแก้ไขข้อผิดพลาด" });
      }
      // Insert Product
      const addProduct = await addDataProductMutation.mutateAsync({
        token: session?.user.accessToken,
        productData: {
          img: dataFrom.img ? dataFrom.img : undefined,
          name: dataFrom.name,
          cost: parseInt(dataFrom.cost, 10),
          price: parseInt(dataFrom.price, 10),
          stock: parseInt(dataFrom.stock, 10),
          unitId: parseInt(dataFrom.unitId, 10),
          productTypeId: parseInt(dataFrom.productTypeId, 10),
          companyId: session?.user.company_id,
          status: dataFrom.status === "Active" ? "Active" : "InActive",
          statusSail: dataFrom.statusSail === "Active" ? "Active" : "InActive",
        },
        setLoadingQuery: setLoadingQuery
      });

      if (addProduct === null) return showMessage({ status: "error", text: "เพิ่มข้อมูลสินค้าไม่สำเร็จ กรุณาลองอีกครั้ง" });
      if (addProduct?.status === true) {
        setTimeout(() => { onClick(); }, 1500);
        return showMessage({ status: "success", text: "เพิ่มข้อมูลสินค้าสำเร็จ" });
      }
      if (typeof addProduct.message !== 'string') setMessageError(addProduct.message);
      return showMessage({ status: "error", text: "เพิ่มข้อมูลสินค้าไม่สำเร็จ กรุณาแก้ไขข้อผิดพลาด" });
    } catch (error: unknown) {
      console.error('Failed to add data:', error);
    }
  };

  const handleRefresh = () => {
    remove();
    return refetch();
  };

  const resetForm = () => {
    if (statusAction === "update") {
      if (editData?.key) {
        setFormValues({
          img: undefined,
          imageUrl: editData.img ? editData.img : undefined,
          name: editData.name,
          cost: editData.cost ? editData.cost.toString() : "0",
          price: editData.price ? editData.price.toString() : "0",
          stock: editData.stock ? editData.stock.toString() : "0",
          unitId: editData.unitId ? editData.unitId.toString() : undefined,
          productTypeId: editData.productTypeId ? editData.productTypeId.toString() : undefined,
          companyId: editData.companyId,
          status: editData.status,
          statusSail: editData.statusSail,
        });
      }
      if (messageError.length > 0) setMessageError([]);
    }
  };

  useEffect(() => {
    const loadComponents = () => {
      if (loadingQuery > 0) {
        dispatch(setLoading({ loadingAction: loadingQuery, showLoading: true }));
      }
    };

    loadComponents();
  }, [loadingQuery]);

  if (isLoading) {
    return <div className="mx-3"><Skeleton.Input active={true} size="small" /></div>;
  }

  if (isError) {
    return <ErrPage onClick={handleRefresh} />;
  }

  const MyForm = ({ onFinish }: { onFinish: (values: object) => void }): React.JSX.Element => {
    return (
      <Form layout="vertical" onFinish={(values) => { setFormValues(values as productSubmit); onFinish(values); }} initialValues={formValues}>
        {/* เลือกรูปภาพ */}
        <div className="grid gap-3 mb-4 grid-cols-1 sml:grid-cols-1">
          <UploadAnt label="เพิ่มรูปภาพสินค้า" name="img" imageUrl={formValues.imageUrl} addImage={formValues.img} setFormValues={setFormValues} status={editData ? "update" : "add"} />
          <InputFrom label="imageUrl" name="imageUrl" required={false} type="hidden" />
        </div>
        {/* ชื่อสินค้า,  */}
        <div className="grid gap-3 mb-4 grid-cols-1 sml:grid-cols-2">
          <InputFrom label="ชื่อสินค้า" name="name" required={true} type="text" />
          <InputFrom label="จำนวนสต็อคสินค้า" name="stock" required={true} type="number" />
        </div>
        {/* ประเภทสินค้า,หน่วยนับ */}
        <div className="grid gap-3 mb-4 grid-cols-1 sml:grid-cols-2">
          <SelectProductType option={data} />
          <SelectUnit option={data} />
        </div>
        {/* ราคาสินค้า,ต้นทุน */}
        <div className="grid gap-3 mb-4 grid-cols-1 sml:grid-cols-2">
          <InputFrom label="ราคาขาย" name="price" required={true} type="float" />
          <InputFrom label="ต้นทุน" name="cost" required={true} type="float" />
        </div>
        {/* สถานะ */}
        <div className="grid gap-3 mb-4 grid-cols-1 sml:grid-cols-2">
          <StatusFrom label="การขายสินค้า" name="statusSail" />
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
