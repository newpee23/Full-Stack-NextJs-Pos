import React from 'react'
import ProductFrom from '../ฺFrom/ProductFrom'

const ProductTable = () => {
    return (
        <>
            <ProductFrom onClick={() => console.log("ss")} statusAction="add" title="เพิ่มข้อมูลตำแหน่งพนักงาน" />
        </>
    )
}

export default ProductTable