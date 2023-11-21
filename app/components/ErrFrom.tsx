import React from "react";
import { List } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";

type Props = {
    showError: { message: string }[];
}

const ErrFrom = ({ showError }: Props) => {
    return (
        <div className="mt-5">
            <div className="m-5 mb-0">
                <p className="text-base text-red-700"><u>พบข้อผิดพลาดกรุณาแก้ไขข้อมูลดังต่อไปนี้</u></p>
            </div>
            <List itemLayout="vertical" size="large" pagination={{ pageSize: 5, }} dataSource={showError}
                renderItem={(item, index) => (
                    <List.Item key={index}>
                        <div className="flex items-center">
                            <CloseCircleOutlined className="mx-2 text-red-700" style={{ fontSize: "24px" }} />
                            <p>{item.message}</p>
                        </div>
                    </List.Item>
                )}
            />
        </div>
    )
}

export default ErrFrom