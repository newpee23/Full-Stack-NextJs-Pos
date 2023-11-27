import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Col, Form, Modal, Upload } from 'antd';
import type { RcFile } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

    type Props = {
        name: string;
        label: string;
    }

const UploadImg = ({ name, label }: Props) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    return (
        <div className="grid gap-3 grid-cols-1 sml:grid-cols-2">
            <Col>
                <Form.Item
                    name={name}
                    label={label}
                    valuePropName="fileList"
                    getValueFromEvent={(e) => e.fileList}
                >

                    <Upload
                        listType="picture-card"
                        maxCount={1} // Set the maximum number of images allowed to be selected
                        beforeUpload={() => false}
                        onPreview={handlePreview}
                    >
                        {uploadButton}
                    </Upload>
                </Form.Item>
                <Modal open={previewOpen} className="text-orange-600" title="รูปภาพตัวอย่าง" footer={null} onCancel={handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </Col>
        </div>
    );
};

export default UploadImg;