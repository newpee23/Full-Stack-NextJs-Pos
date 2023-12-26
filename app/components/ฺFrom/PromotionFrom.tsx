import { fetchPromotion } from '@/types/fetchData';
import { Form, Input, Modal, Upload, UploadFile, UploadProps, message } from 'antd';
import React, { useEffect, useState } from 'react'
import InputFrom from '../UI/InputFrom';
import ProgressBar from '../UI/loading/ProgressBar';
import SaveBtn from '../UI/btn/SaveBtn';
import StatusFrom from '../UI/select/StatusFrom';
import DrawerActionData from '../DrawerActionData';
import UploadAnt from '../UI/upload/UploadProduct';
import { RcFile } from 'antd/lib/upload';
import { Moment } from 'moment';
import Image from "next/image";
import { PlusOutlined } from '@ant-design/icons';
import { getBase64 } from '@/app/lib/getLocalBase64';
import UploadPromotion from '../UI/upload/UploadPromotion';
import { useAddDataPromotion, useUpdateDataPromotion } from '@/app/api/promotion';
import { useAppDispatch } from '@/app/store/store';
import { setLoading } from '@/app/store/slices/loadingSlice';
import { useSession } from 'next-auth/react';
import { parseDateStringToMoment } from './validate/validate';
import { QueryObserverResult } from 'react-query';

type Props = {
    onClick: () => Promise<QueryObserverResult<fetchPromotion[], unknown>>;
    editData?: fetchPromotion;
    title: string;
    statusAction: "add" | "update";
}

export interface promotionSubmit {
    img: {
      file: File
    } | undefined;
    imageUrl: string | undefined;
    name: string;
    detail: string;
    promotionalPrice: string;
    startDate: Moment | undefined;
    endDate: Moment | undefined;
    companyId: number | undefined;
    status: string;
}

const PromotionFrom = ({ onClick, editData, statusAction, title }: Props) => {
    
    const dispatch = useAppDispatch();
    const { data: session } = useSession();
    const [messageApi, contextHolder] = message.useMessage();
    const addDataPromotionMutation = useAddDataPromotion();
    const updateDataPromotionMutation = useUpdateDataPromotion();
    const [messageError, setMessageError] = useState<{ message: string }[]>([]);
    const [loadingQuery, setLoadingQuery] = useState<number>(0);
    const [formValues, setFormValues] = useState<promotionSubmit>({
        img: undefined,
        imageUrl: undefined,
        name: "",
        detail: "",
        promotionalPrice: "",
        startDate: undefined,
        endDate: undefined,
        companyId: undefined,
        status: "Active",
    });
    
  
    const resetForm = () => {
      if (statusAction === "update") {
        if (editData?.key) {
          setFormValues({
            img: undefined,
            imageUrl: editData.img,
            name: editData.name,
            detail: editData.detail,
            promotionalPrice: editData.promotionalPrice.toString(),
            startDate: parseDateStringToMoment(editData.startDate.toString()),
            endDate: parseDateStringToMoment(editData.endDate.toString()),
            companyId: editData.companyId,
            status: "Active",
          });
        }
        if (messageError.length > 0) setMessageError([]);
      }
    }

    const showMessage = ({ status, text }: { status: string; text: string }) => {
        if (status === 'success') {
          messageApi.success(text);
        } else if (status === 'error') {
          messageApi.error(text);
        } else if (status === 'warning') {
          messageApi.warning(text);
        }
      };
  
    const handleSubmit = async (values: promotionSubmit) => {
        setFormValues(values);
        setLoadingQuery(0);
        try {
            if (!session?.user.company_id) return showMessage({ status: "error", text: "พบข้อผิดพลาดกรุณาเข้าสู่ระบบใหม่อีกครั้ง" });
            if (!values.startDate) return showMessage({ status: "error", text: "กรุณาระบุวันที่เริ่มโปรโมชั่น" });
            if (!values.endDate) return showMessage({ status: "error", text: "กรุณาระบุวันที่หมดโปรโมชั่น" });

            dispatch(setLoading({ loadingAction: 0, showLoading: true }));
            // Update Promotion
            if (editData?.key) {
      
              const updatePromotion = await updateDataPromotionMutation.mutateAsync({
                token: session?.user.accessToken,
                promotionData: {
                  id: parseInt(editData.key, 10),
                  img: values.img ? values.img : undefined,
                  imageUrl: values.imageUrl,
                  name: values.name,
                  detail: values.detail,
                  promotionalPrice: parseInt(values.promotionalPrice, 10),
                  startDate: values.startDate.toDate(),
                  endDate: values.endDate.toDate(),
                  companyId: session?.user.company_id,
                  status: values.status === "Active" ? "Active" : "InActive",
                },
                setLoadingQuery: setLoadingQuery
              });
      
              if (updatePromotion === null) return showMessage({ status: "error", text: "แก้ไขข้อมูลโปรโมชั่นไม่สำเร็จ กรุณาลองอีกครั้ง" });
              if (updatePromotion?.status === true) {
                setTimeout(() => { onClick(); }, 1500);
                return showMessage({ status: "success", text: "แก้ไขข้อมูลโปรโมชั่นสำเร็จ" });
              }
              if (typeof updatePromotion.message !== 'string') setMessageError(updatePromotion.message);
              return showMessage({ status: "error", text: "แก้ไขข้อมูลโปรโมชั่นไม่สำเร็จ กรุณาแก้ไขข้อผิดพลาด" });
            }
            // Insert Promotion
            const addPromotion = await addDataPromotionMutation.mutateAsync({
              token: session?.user.accessToken,
              promotionData: {
                img: values.img ? values.img : undefined,
                name: values.name,
                detail: values.detail,
                promotionalPrice: parseInt(values.promotionalPrice, 10),
                startDate: values.startDate.toDate(),
                endDate: values.endDate.toDate(),
                companyId: session?.user.company_id,
                status: values.status === "Active" ? "Active" : "InActive",
              },
              setLoadingQuery: setLoadingQuery
            });
      
            if (addPromotion === null) return showMessage({ status: "error", text: "เพิ่มข้อมูลโปรโมชั่นไม่สำเร็จ กรุณาลองอีกครั้ง" });
            if (addPromotion?.status === true) {
              setTimeout(() => { onClick(); }, 1500);
              return showMessage({ status: "success", text: "เพิ่มข้อมูลโปรโมชั่นสำเร็จ" });
            }
            if (typeof addPromotion.message !== 'string') setMessageError(addPromotion.message);
            return showMessage({ status: "error", text: "เพิ่มข้อมูลโปรโมชั่นไม่สำเร็จ กรุณาแก้ไขข้อผิดพลาด" });
          } catch (error: unknown) {
            console.error('Failed to add data:', error);
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
  
    const MyForm = (): React.JSX.Element => {
        return (
            <Form layout="vertical" onFinish={(values) => { handleSubmit(values as promotionSubmit); }} initialValues={formValues}>
                {/* เลือกรูปภาพ */}
                <div className="grid gap-3 mb-4 grid-cols-1 sml:grid-cols-1">
                <UploadPromotion label="เพิ่มรูปภาพโปรโมชั่น" name="img" imageUrl={formValues.imageUrl} addImage={formValues.img} setFormValues={setFormValues} status={editData ? "update" : "add"} />
                    {/* <InputFrom label="imageUrl" name="imageUrl" required={false} type="hidden" /> */}
                </div>
                {/* ชื่อโปรโมชั่น */}
                <div className="grid gap-3 mb-4 grid-cols-1 sml:grid-cols-2">
                    <InputFrom label="ชื่อโปรโมชั่น" name="name" required={true} type="text" />
                </div>
                {/* รายละเอียด */}
                <div className="grid gap-3 mb-4 grid-cols-1 sml:grid-cols-1">
                    <InputFrom label="รายละเอียด" name="detail" required={true} type="textArea" />
                </div>
                {/* ราคาขาย */}
                <div className="grid gap-3 mb-4 grid-cols-1 sml:grid-cols-2">
                    <InputFrom label="ราคาโปรโมชั่น" name="promotionalPrice" required={true} type="float" />
                </div>
                {/* เริ่มและสิ้นสุดโปรโมชั่น */}
                <div className="grid gap-3 mb-4 grid-cols-1 sml:grid-cols-2">
                    <InputFrom label="วันที่เริ่มโปรโมชั่น" name="startDate" required={true} type="datePicker" />
                    <InputFrom label="วันที่หมดโปรโมชั่น" name="endDate" required={true} type="datePicker" />
                </div>
                {/* สถานะ */}
                <div className="grid gap-3 mb-4 grid-cols-1 sml:grid-cols-2">

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
            <DrawerActionData resetForm={resetForm} formContent={<MyForm />} title={title} showError={messageError} statusAction={statusAction} />
        </div>
    )
}

export default PromotionFrom