import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Col, Form, Modal, Upload } from 'antd';


type Props = {
    name: string;
    label: string;
    setImage: (selectedFile: File) => void;
}

const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });


const UploadImg = ({ name, label, setImage }: Props) => {
    const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');
    
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        // Get the selected file from the input
        const file = e.target.files && e.target.files[0];

        if (file) {
            // Update the image state with the selected file
            // setImage(file);
            console.log(file)
            const imageUrl = await getBase64(file);
            setSelectedImageUrl(imageUrl);     
        }
    };

    return (
        <div className="grid gap-3 grid-cols-1 sml:grid-cols-2 mb-3">
            <Col>
                <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <PlusOutlined className="mb-3"/>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">PNG or JPG (MAX. 10MB)</p>
                        </div>
                        <input id="dropzone-file" type="file" style={{ display: 'none' }} onChange={handleFileChange} />
                    </label>
                    <div>
                    {selectedImageUrl && (
                        <img alt="selected" style={{ width: '100%' }} src={selectedImageUrl} />
                    )}
                    </div>
                </div>
      
            </Col>
        </div>
    );
};

export default UploadImg;