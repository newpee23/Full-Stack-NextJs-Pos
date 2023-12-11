import React from 'react'
import DrawerCustom from '../DrawerCustom';
import { Form } from 'antd';
import InputFrom from '../UI/InputFrom';
import ProgressBar from '../UI/loading/ProgressBar';
import SaveBtn from '../UI/btn/SaveBtn';

type Props = {
    id: string;
    tableName: string;
}

const TransactionFrom = ({ id, tableName }: Props) => {

    const MyForm = (): React.JSX.Element => {
        return (
            <Form layout="vertical" onFinish={(values) => { console.log("values") }}>
                {/* จำนวนคน */}
                <div className="grid gap-3 mb-4 grid-cols-1 sml:grid-cols-2">
                    <InputFrom label="จำนวนคน" name="peoples" required={true} type="number" />
                    <div className="flex items-end justify-start">
                        <SaveBtn label="บันทึกข้อมูล" />
                    </div>
                </div>
                <ProgressBar />
          
            </Form>
        );
    };

    return (
        <div>
            <DrawerCustom resetForm={() => console.log("sss")} formContent={<MyForm />} showError={[]} statusAction="add" title={`เปิดบิลขาย (${tableName})`} titleBtn="เปิดบิล" />
        </div>
    )
}

export default TransactionFrom;