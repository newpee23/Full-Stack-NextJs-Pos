import React from "react"
import HeadNameComponent from "../UI/HeadNameComponent"
import { Col, Form, Input } from "antd"
import InputFrom from "../UI/InputFrom"
import { fetchCompany } from "@/types/fetchData";
import DrawerActionData from "../DrawerActionData";
import { validateWhitespace } from "./validate/validate";
import ProgressBar from "../UI/loading/ProgressBar";
import SaveBtn from "../UI/btn/SaveBtn";
import StatusFrom from "../UI/select/StatusFrom";

interface Props {
  onClick: () => void;
  editData?: fetchCompany;
  title: string;
  statusAction: "add" | "update";
};

const CompanyFrom = ({ onClick, title, statusAction, editData }: Props) => {
  
  const resetForm = () => {
    
  }

  const handleSubmit = async () => {
    
  }

  const MyForm = ({ onFinish }: { onFinish: (values: object) => void }): React.JSX.Element => {
    return (
        <Form layout="vertical" onFinish={(values) => {  }}>
                {/* ชื่อบริษัท */}
                <div className="grid gap-3 mb-3 grid-cols-1 sml:grid-cols-2">
                    <InputFrom label="ชื่อบริษัท" name="name" required={true} type="text"/>
                </div>
                {/* เลขเสียภาษี เบอร์โทร อีเมล */}
                <div className="grid gap-3 mb-3 grid-cols-1 sml:grid-cols-3">
                    <InputFrom label="เลขประจำตัวผู้เสียภาษี" name="tax" required={true} type="text" />
                    <InputFrom label="อีเมล์" name="email" required={true} type="text" />
                    <InputFrom label="เบอรืโทรศัพท์" name="phone" required={true} type="number" />
                </div>
                {/* ที่อยู่บริษัท */}
                <div className="grid gap-3 mb-3 grid-cols-1 sml:grid-cols-1">
                    <InputFrom label="ที่อยู่บริษัท" name="address" required={true} type="textArea"/>
                </div>
                {/* สถานะ */}
                <div className="grid gap-3 mb-3 grid-cols-1 sml:grid-cols-2">
                    <StatusFrom label="สถานะ" name="status" />
                </div>
            <ProgressBar />
            <SaveBtn label="บันทึกข้อมูล" />
        </Form>
    );
  };

  return (
    <div>
        {/* {contextHolder} */}
        <DrawerActionData resetForm={resetForm} formContent={<MyForm onFinish={handleSubmit} />} title={title} showError={[]} statusAction={statusAction} />
    </div>
)
}

export default CompanyFrom