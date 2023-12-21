import { productDataCustomerFrontData } from "@/types/fetchData";
import { Card } from "antd"
import Meta from "antd/lib/card/Meta"
import React from "react"

type Props = {
    productData: productDataCustomerFrontData[];
}

const CardProduct = ({ productData }: Props) => {
    return (
        productData.map((product) => (
            product.Products && product.Products.length > 0 && (
                <div id={product.id.toString()} key={product.id} className="mt-3">
                    <div>
                        <p>{product.name}</p>
                    </div>
                    <div className="grid gap-3 grid-cols-2 md:grid-cols-3 mdl:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mt-3">
                        {product.Products.map((subProduct) => (
                            <Card key={subProduct.id} hoverable bordered={false}
                                cover={<img className="object-fill h-auto w-full xs:max-h-[130px] sm:max-h-[145px] sml:max-h-[185px]" alt={subProduct.name} src={`${subProduct.img ? `${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${subProduct.img}` : "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"}`} />}
                            >
                                <Meta title={subProduct.name} description={`ราคา ${subProduct.price} บาท`} />
                            </Card>
                        ))}
                    </div>
                </div>
            )
        ))
    )
}

export default CardProduct