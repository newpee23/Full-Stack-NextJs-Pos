import { Card } from "antd"
import Meta from "antd/lib/card/Meta"
import React from "react"

type Props = {}

const CardProduct = (props: Props) => {
    return (
        <div className="grid gap-3 grid-cols-2 mdl:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mt-5">
            <Card
                hoverable bordered={false}
                cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" /> } >
                <Meta title="หมูสามชั้น 3 ชิ้น" description="ราคา 100.00 บาท"/>
            </Card>
        </div>
    )
}

export default CardProduct