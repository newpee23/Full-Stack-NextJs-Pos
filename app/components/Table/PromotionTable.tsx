import React from 'react'
import RefreshBtn from '../UI/btn/RefreshBtn';
import PromotionFrom from '../ฺFrom/PromotionFrom';


const PromotionTable = () => {

    const handleRefresh = async () => {
        return console.log("handleRefresh")
    };

    return (
        <div>
            <div className="flex items-center justify-between">
                <PromotionFrom onClick={handleRefresh} statusAction="add" title="เพิ่มข้อมูลโปรโมชั่น" />
                <RefreshBtn label="Refresh Data" onClick={handleRefresh} />
            </div>
        </div>
    )
}

export default PromotionTable