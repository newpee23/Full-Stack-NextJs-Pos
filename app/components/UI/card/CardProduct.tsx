import { Card } from "antd"
import Meta from "antd/lib/card/Meta"
import React from "react"

type Props = {}

const CardProduct = (props: Props) => {
    return (
        <div className="">
            <Card
                cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" /> } >
                <Meta title="Card title" description="This is the description"/>
            </Card>
        </div>
    )
}

export default CardProduct