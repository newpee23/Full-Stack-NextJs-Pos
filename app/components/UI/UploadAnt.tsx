import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Form, Modal, Upload } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';

type Props = {
    name: string;
    label: string;
    imageUrl: string | undefined;
    addImage: any;
 }

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const UploadAnt = ({ name, label, imageUrl, addImage }: Props) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
     
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
      
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);

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
                    uid: '-1',
                    name: 'รูปภาพสินค้า',
                    status: 'done',
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
                    uid: '-1',
                    name: 'รูปภาพสินค้า',
                    status: 'done',
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
                <Upload maxCount={1} listType="picture-card" fileList={fileList} onPreview={handlePreview} onChange={handleChange} beforeUpload={() => false} accept="image/*">
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
            </Form.Item>
            <Modal open={previewOpen} title="รูปภาพสินค้า" footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    );
};

export default UploadAnt;