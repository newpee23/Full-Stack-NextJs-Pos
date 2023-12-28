import { DeleteOutlined, LoadingOutlined, MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { List, Spin } from "antd";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import { cartIncrementItem, itemCartType, cartDecrementItem, removeCartItem, cleanCart } from "@/app/store/slices/cartSlice";

export interface dataType {
    title: React.ReactNode;
    avatar: string;
    description: React.ReactNode;
    content: string;
}

const ListCartOrderItem = () => {

    const dispatch = useAppDispatch();
    const [ loading, SetLoading ] = useState<boolean>(false);
    const { itemCart, totalPrice } = useAppSelector((state) => state?.cartSlice);
   

    const handleIncrementItem = (cartItem: itemCartType) => {
        dispatch(cartIncrementItem({ productId: cartItem.productId, image: cartItem.image, name: cartItem.name, price: cartItem.price, qty: 1 }));
    }

    const handleDecrementItem = (cartItem: itemCartType) => {
        dispatch(cartDecrementItem(cartItem.productId));
    }

    const handleRemoveItem = (productId: number) => {
        dispatch(removeCartItem(productId))
    }

    const data: dataType[] = itemCart.map((cartItem) => ({
        title: (
            <div className="flex justify-between">
                <p>{cartItem.name}</p>
                <p><DeleteOutlined  onClick={() => handleRemoveItem(cartItem.productId)} /></p>
            </div>
        ),
        avatar: cartItem.image || "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png", // Use the image from the cart item, or an empty string if not available
        description: (
            <div className="flex justify-between">
                <p className="text-orange-600">{`ราคา ${cartItem.price} บาท`}</p>
                <div className="flex">
                    <MinusCircleOutlined  className="mr-1" onClick={() => handleDecrementItem(cartItem)} />
                    <p className="text-black">{`${cartItem.qty} ชิ้น`}</p>
                    <PlusCircleOutlined  className="ml-1" onClick={() => handleIncrementItem(cartItem)} />
                </div>
            </div>
        ),
        content: "",
    }));

    return (
        <>
        <Spin tip="Loading..." spinning={loading}>
            <List itemLayout="vertical" size="large" pagination={{ pageSize: 5 }} dataSource={data}
                footer={
                    <div className={`w-full text-orange-600 flex items-center ${itemCart.length > 0 ? "justify-between" : "justify-end"}`}>
                        {itemCart.length > 0 &&
                            <button type="button"  onClick={() => dispatch(cleanCart())} className="text-red-500 py-1 px-2 border rounded-md text-sm drop-shadow-md hover:bg-red-600 hover:text-white hover:drop-shadow-xl whitespace-nowrap transition-transform transform hover:scale-105">
                                <span className="ml-1">ลบสินค้าทั้งหมด</span>
                            </button>
                        }
                        <p>รวม {totalPrice} บาท</p>
                    </div>
                }
                renderItem={(item, index) => (
                    <List.Item key={index}>
                        <List.Item.Meta
                            avatar={<img className="object-fill rounded-md h-auto w-[40px]" alt={item.avatar} src={item.avatar} />}
                            title={item.title}
                            description={item.description}
                        />
                        {item.content}
                    </List.Item>
                )}
            />
        </Spin>
            <div className="text-center mt-3">
                <button type="button"  onClick={() => SetLoading(!loading)} className="text-white bg-orange-600 py-1 px-4 border rounded-md text-sm drop-shadow-md hover:bg-orange-700 hover:text-white hover:drop-shadow-xl whitespace-nowrap transition-transform transform hover:scale-105">
                    <span>สั่งสินค้า</span>
                    {loading &&
                        <Spin className="ml-2" indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                    }
                </button>
            </div>
        </>
    );
}

export default ListCartOrderItem;