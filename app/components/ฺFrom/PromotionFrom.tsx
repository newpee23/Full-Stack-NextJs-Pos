import { fetchPromotion } from '@/types/fetchData';
import { Form, Modal, Upload, UploadFile, UploadProps, message } from 'antd';
import React, { useState } from 'react'
import InputFrom from '../UI/InputFrom';
import ProgressBar from '../UI/loading/ProgressBar';
import SaveBtn from '../UI/btn/SaveBtn';
import StatusFrom from '../UI/select/StatusFrom';
import DrawerActionData from '../DrawerActionData';
import UploadAnt from '../UI/UploadAnt';
import { RcFile } from 'antd/lib/upload';
import { Moment } from 'moment';
import Image from "next/image";
import { PlusOutlined } from '@ant-design/icons';
import { getBase64 } from '@/app/lib/getLocalBase64';

type Props = {
    onClick: () => Promise<void>;
    editData?: fetchPromotion;
    title: string;
    statusAction: "add" | "update";
}

export interface promotionSubmit {
    img: RcFile | undefined;
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
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>("");
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [messageError, setMessageError] = useState<{ message: string }[]>([]);
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
        console.log("resetForm")
    }

    const handleSubmit = async (values: object) => {
        console.log(values);
    };

    const handleCancel = () => setPreviewOpen(false);

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleRemove = () => {
        setFormValues(prevData => ({
            ...prevData,
            imageUrl: undefined,
        }));
    };
    
    const MyForm = ({ onFinish }: { onFinish: (values: object) => void }): React.JSX.Element => {
        return (
            <Form layout="vertical" onFinish={(values) => { setFormValues(values as promotionSubmit); onFinish(values); }} initialValues={formValues}>
                {/* เลือกรูปภาพ */}
                <div className="grid gap-3 grid-cols-1 sml:grid-cols-1">
                    <Form.Item name="img" label="รูปภาพโปรโมชั่น">
                        <Upload maxCount={1} listType="picture-card" fileList={fileList} onRemove={handleRemove} onPreview={handlePreview} onChange={handleChange} beforeUpload={() => false} accept="image/*">
                            {fileList.length >= 8 ? null : uploadButton}
                        </Upload>
                    </Form.Item>
                    <Modal open={previewOpen} title="รูปภาพโปรโมชั่น" footer={null} onCancel={handleCancel}>
                        <Image
                            src={previewImage}
                            className="w-full h-auto rounded-md mx-auto"
                            width={650}
                            height={366}
                            sizes="(min-width:720px) 650px, calc(95.5vw - 19px)"
                            alt="productImage"
                        />

                    </Modal>
                    
                    <InputFrom label="imageUrl" name="imageUrl" required={false} type="hidden" />
                </div>
                {/* ชื่อโปรโมชั่น */}
                <div className="grid gap-3 grid-cols-1 sml:grid-cols-2">
                    <InputFrom label="ชื่อโปรโมชั่น" name="name" required={true} type="text" />
                </div>
                {/* รายละเอียด */}
                <div className="grid gap-3 grid-cols-1 sml:grid-cols-1">
                    <InputFrom label="รายละเอียด" name="detail" required={true} type="textArea" />
                </div>
                {/* ราคาขาย */}
                <div className="grid gap-3 grid-cols-1 sml:grid-cols-2">
                    <InputFrom label="ราคาโปรโมชั่น" name="promotionalPrice" required={true} type="float" />
                </div>
                {/* เริ่มและสิ้นสุดโปรโมชั่น */}
                <div className="grid gap-3 grid-cols-1 sml:grid-cols-2">
                    <InputFrom label="วันที่เริ่มโปรโมชั่น" name="startDate" required={true} type="datePicker" />
                    <InputFrom label="วันที่หมดโปรโมชั่น" name="endDate" required={true} type="datePicker" />
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
    )
}

export default PromotionFrom