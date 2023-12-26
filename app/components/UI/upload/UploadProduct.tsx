import Image from "next/image";
import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Form, Modal, Upload } from "antd";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";
import { productSubmit } from "../../ฺFrom/ProductFrom";
import { getBase64 } from "@/app/lib/getLocalBase64";

type Props = {
    name: string;
    label: string;
    imageUrl: string | undefined;
    addImage: any;
    status: "update" | "add";
    setFormValues: React.Dispatch<React.SetStateAction<productSubmit>>;
}

const UploadAnt = ({ name, label, imageUrl, addImage, setFormValues, status }: Props) => {
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>("");
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {   
        if(file.size){
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj as RcFile);
            }
    
            setPreviewImage(file.url || (file.preview as string));
        }else{
            setPreviewImage(file.url as string);
        }
        setPreviewOpen(true);
    };

    const handleRemove = () => {
        setFormValues(prevData => ({
            ...prevData,
            imageUrl: undefined,
        }));
    };

    const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }


    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    useEffect(() => {
        const loadSetFileList = async () => {
            if (imageUrl) {
                setFileList([
                    {
                        uid: "-1",
                        name: "รูปภาพสินค้า",
                        status: "done",
                        url: `${imageUrl}`,
                    }
                ]);
            }
        };

        return () => {
            loadSetFileList();
        };
    }, [imageUrl]);

    useEffect(() => {
        const loadSetFileList = async () => {
            if (addImage?.fileList[0]) {
                const file: UploadFile = addImage.fileList[0];
                if (!file.url && !file.preview) {
                    const imageBase64 = await getBase64(file.originFileObj as RcFile);
                    setFileList([
                        {
                            uid: "-1",
                            name: "รูปภาพสินค้า",
                            status: "done",
                            url: `${imageBase64}`,
                        }
                    ]);
                }
            }
        }
        // Return void instead of an async function
        return () => {
            loadSetFileList();
        };
    }, [addImage]);

    return (
        <>
            <Form.Item name={name} label={label}>
                <Upload maxCount={1} listType="picture-card" fileList={fileList} onRemove={handleRemove} onPreview={handlePreview} onChange={handleChange} beforeUpload={() => false} accept="image/*">
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
            </Form.Item>
            <Modal open={previewOpen} title="รูปภาพสินค้า" footer={null} onCancel={handleCancel}>
                <Image
                    src={previewImage}
                    className="w-full h-auto rounded-md mx-auto"
                    width={650}
                    height={366}
                    sizes="(min-width:720px) 650px, calc(95.5vw - 19px)"
                    alt="productImage"
                />

            </Modal>
        </>
    );
};

export default UploadAnt;