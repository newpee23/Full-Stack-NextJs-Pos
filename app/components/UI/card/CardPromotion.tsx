import { detailPromotion, promotionDataCustomerFrontData } from '@/types/fetchData';
import { Card } from 'antd';
import React, { useState } from 'react';
import AddModalPromotion from '../modal/AddModalPromotion';

type Props = {
    promotionData: promotionDataCustomerFrontData[];
};

const CardPromotion = ({ promotionData }: Props) => {

    const [open, setOpen] = useState(false);
    const [selectItemPromotion, setSelectItemPromotion] = useState<detailPromotion>();

    return (
        <div className="mb-3">
            <div className="w-full text-center">
                <p>โปรโมชั่นประจำสาขา</p>
            </div>
            <div className="grid gap-2 grid-cols-1 md:grid-cols-3 mdl:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mt-3">
                {promotionData.map((promotion) => (

                    <Card key={promotion.id} hoverable bordered={false} className="border" onClick={() => { setOpen(!open); setSelectItemPromotion({ promotionId: promotion.id, detail: promotion.detail, name: promotion.name, img: promotion.img, itemPromotionsStock: promotion.ItemPromotions, promotionPrice: promotion.promotionalPrice }); }}>
                        <div className="flex justify-between">
                            <div className="flex items-center flex-col justify-between">
                                <div className="flex justify-start w-full">
                                    {promotion.name}
                                </div>
                                <div className="flex justify-start w-full text-xs text-orange-600 mt-1">
                                    {`ราคา ${promotion.promotionalPrice} บาท`}
                                </div>
                            </div>
                            <img className="object-fill rounded-md h-[50px] w-[80px] xs:max-h-[100px] sm:max-h-[145px] sml:max-h-[185px]" alt={promotion.name} src={`${promotion.img ? `${promotion.img}` : "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"}`} />
                        </div>
                    </Card>

                ))}
            </div>
            <div>
                <hr className="bg-orange-600 my-2" />
            </div>
            <AddModalPromotion open={open} setOpen={setOpen} selectItemPromotion={selectItemPromotion} />
        </div>
    );
};

export default CardPromotion;
