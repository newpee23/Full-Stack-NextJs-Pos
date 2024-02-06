import React, { useState } from "react";
import { Form } from "antd";
import InputFrom from "../UI/InputFrom";
import { fetchCompany } from "@/types/fetchData";
import DrawerActionData from "../DrawerActionData";
import ProgressBar from "../UI/loading/ProgressBar";
import SaveBtn from "../UI/btn/SaveBtn";
import StatusFrom from "../UI/select/StatusFrom";

interface Props {
  onClick: () => void;
  editData?: fetchCompany;
  title: string;
  statusAction: "add" | "update";
}

interface companySubmit {
  name: string;
  address: string;
  tax: string;
  phone: string;
  email: string;
  status: "Active" | "InActive";
}

const CompanyFrom = ({ onClick, title, statusAction, editData }: Props) => {
  const [formValues, setFormValues] = useState<companySubmit>({
    name: "",
    address: "",
    tax: "",
    phone: "",
    email: "",
    status: "Active"
  });

  const resetForm = () => {};

  const handleSubmit = async (values: companySubmit) => {
    console.log(values)
  };

  const MyForm = (): React.JSX.Element => {
    return (
      <Form layout="vertical" onFinish={(values) => {setFormValues(values as companySubmit); handleSubmit(values as companySubmit)}} initialValues={formValues}>
        {/* ชื่อบริษัท */}
        <div className="grid gap-3 mb-3 grid-cols-1 sml:grid-cols-2">
          <InputFrom
            label="ชื่อบริษัท"
            name="name"
            required={true}
            type="text"
          />
        </div>
        {/* เลขเสียภาษี เบอร์โทร อีเมล */}
        <div className="grid gap-3 mb-3 grid-cols-1 sml:grid-cols-3">
          <InputFrom
            label="เลขประจำตัวผู้เสียภาษี"
            name="tax"
            required={true}
            type="text"
          />
          <InputFrom label="อีเมล์" name="email" required={true} type="text" />
          <InputFrom
            label="เบอร์โทรศัพท์"
            name="phone"
            required={true}
            type="number"
          />
        </div>
        {/* ที่อยู่บริษัท */}
        <div className="grid gap-3 mb-3 grid-cols-1 sml:grid-cols-1">
          <InputFrom
            label="ที่อยู่บริษัท"
            name="address"
            required={true}
            type="textArea"
          />
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
      <DrawerActionData
        resetForm={resetForm}
        formContent={<MyForm />}
        title={title}
        showError={[]}
        statusAction={statusAction}
      />
    </div>
  );
};

export default CompanyFrom;
