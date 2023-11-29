import Image from "next/image";
import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Form, Modal, Upload } from "antd";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";
import { productSubmit } from "../ฺFrom/ProductFrom";
import { getBase64 } from "@/app/lib/getLocalBase64";
import bgLoading from "@/public/images/loadBg.jpg";

type Props = {
    name: string;
    label: string;
    imageUrl: string | undefined;
    addImage: any;
    setFormValues: React.Dispatch<React.SetStateAction<productSubmit>>;
}

const UploadAnt = ({ name, label, imageUrl, addImage, setFormValues }: Props) => {
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>("");
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    
    const handleCancel = () => setPreviewOpen(false);

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
        const loadSetFileList = () => {
            if (imageUrl) {
                setFileList([
                    {
                        uid: "-1",
                        name: "รูปภาพสินค้า",
                        status: "done",
                        url: `${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${imageUrl}`,
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
            if (addImage) {
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
        };

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
                layout="responsive"
                width={100}
                height={100}
                alt="productImage"
                priority
            />
           
            </Modal>
        </>
    );
};

export default UploadAnt;