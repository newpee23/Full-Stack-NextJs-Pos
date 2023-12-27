import { productData, productDataCustomerFrontData } from "@/types/fetchData";
import { Card } from "antd"
import React, { useState } from "react"
import AddModalProduct from "../modal/AddModalProduct";


type Props = {
    productData: productDataCustomerFrontData[];
}

const CardProduct = ({ productData }: Props) => {

    const [open, setOpen] = useState(false);
    const [selectProduct , setSelectPorduct] = useState<productData>();

    return (
        <>
            {productData.map((product) => (
                product.Products && product.Products.length > 0 && (

                    <div id={`/product/${product.id.toString()}`} key={product.id}>
                        <div className="w-full text-center">
                            <p>{product.name}</p>
                        </div>

                        <div className="grid gap-2 grid-cols-1 md:grid-cols-3 mdl:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mt-3">
                            {product.Products.map((subProduct) => (
                                <div key={subProduct.id}>
                                    <Card hoverable bordered={false} className="border" onClick={() => {setOpen(!open);setSelectPorduct(subProduct);}}>
                                        <div className="flex justify-between">
                                            <div className="flex items-center flex-col justify-between">
                                                <div className="flex justify-start w-full">
                                                    {subProduct.name}
                                                </div>
                                                <div className="flex justify-start w-full text-xs text-orange-600">
                                                    {`ราคา ${subProduct.price} บาท`}
                                                </div>
                                            </div>
                                            <img className="object-fill rounded-md h-[50px] w-[80px] xs:max-h-[100px] sm:max-h-[145px] sml:max-h-[185px]" alt={subProduct.name} src={`${subProduct.img ? `${subProduct.img}` : "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"}`} />
                                        </div>
                                    </Card>
                                </div>
                            ))}

                        </div>
                        <div>
                            <hr className="bg-orange-600 my-2" />
                        </div>
                    </div>

                )
            ))}
            <AddModalProduct open={open} setOpen={setOpen} selectProduct={selectProduct}/>
        </>
    )
}

export default CardProduct