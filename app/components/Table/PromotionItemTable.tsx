import { message } from 'antd';
import { useSession } from 'next-auth/react';
import React from 'react'
import RefreshBtn from '../UI/btn/RefreshBtn';
import PromotionItemFrom from '../ฺFrom/PromotionItemFrom';

type Props = {}

const PromotionItemTable = (props: Props) => {
    const { data: session } = useSession();
    const [messageApi, contextHolder] = message.useMessage();

    const showMessage = ({ status, text }: { status: string, text: string }) => {
        if (status === 'success') { messageApi.success(text); }
        else if (status === 'error') { messageApi.error(text); }
        else if (status === 'warning') { messageApi.warning(text); }
    };

  return (
    <div>
            <div className="flex items-center justify-between">
                <PromotionItemFrom onClick={() => console.log("onClick")} statusAction="add" title="เพิ่มข้อมูลโปรโมชั่น" />
                <RefreshBtn label="Refresh Data" onClick={() => console.log("onClick")} />
            </div>
            <div className="overflow-x-auto m-3">
                {/* <Table columns={columnsPromotion} dataSource={data || []} bordered title={() => "ฐานข้อมูลหัวข้อโปรโมชั่น"} /> */}
            </div>
            {contextHolder}
        </div>
  )
}

export default PromotionItemTable