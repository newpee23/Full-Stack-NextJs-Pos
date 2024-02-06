import React, { useEffect, useState } from "react";
import { Form, message } from "antd";
import InputFrom from "../UI/InputFrom";
import { fetchCompany } from "@/types/fetchData";
import DrawerActionData from "../DrawerActionData";
import ProgressBar from "../UI/loading/ProgressBar";
import SaveBtn from "../UI/btn/SaveBtn";
import StatusFrom from "../UI/select/StatusFrom";
import { useSession } from "next-auth/react";
import { useAppDispatch } from "@/app/store/store";
import { setLoading } from "@/app/store/slices/loadingSlice";
import { useAddDataCompany, useUpdateDataCompany } from "@/app/api/company";

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
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const addDataCompanyMutation = useAddDataCompany();
  const updateDataCompanyMutation = useUpdateDataCompany();
  const [messageApi, contextHolder] = message.useMessage();
  const [loadingQuery, setLoadingQuery] = useState<number>(0);
  const [messageError, setMessageError] = useState<{ message: string }[]>([]);
  const [formValues, setFormValues] = useState<companySubmit>({
    name: "",
    address: "",
    tax: "",
    phone: "",
    email: "",
    status: "Active",
  });

  const resetForm = () => {
    if (statusAction === "update") {
      if (editData?.key) {
        setFormValues({
          name: editData.name,
          phone: editData.phone,
          email: editData.email,
          tax: editData.tax,
          address: editData.address,
          status: editData.status,
        });
      }
    }
  };

  const handleSubmit = async (values: companySubmit) => {
    setLoadingQuery(0);
    dispatch(setLoading({ loadingAction: 0, showLoading: true }));
    try {
      if (!session?.user.company_id) {
        return showMessage({
          status: "error",
          text: "พบข้อผิดพลาดกรุณาเข้าสู่ระบบใหม่อีกครั้ง",
        });
      }
      // Update company
      if (editData?.key) {
        const updateCompany = await updateDataCompanyMutation.mutateAsync({
          token: session?.user.accessToken,
          companyData: {
            id: parseInt(editData.key, 10),
            name: values.name,
            address: values.address,
            email: values.email,
            phone: values.phone,
            tax: values.tax,
            logo: "",
            status: values.status,
          },
          setLoadingQuery: setLoadingQuery,
        });

        if (updateCompany === null)
          return showMessage({
            status: "error",
            text: "แก้ไขข้อมูลบริษัทไม่สำเร็จ กรุณาลองอีกครั้ง",
          });
        if (updateCompany?.status === true) {
          setTimeout(() => {
            onClick();
          }, 1500);
          return showMessage({
            status: "success",
            text: "แก้ไขข้อมูลบริษัทสำเร็จ",
          });
        }
        if (typeof updateCompany.message !== "string")
          setMessageError(updateCompany.message);
        return showMessage({
          status: "error",
          text: "แก้ไขข้อมูลบริษัทไม่สำเร็จ กรุณาแก้ไขข้อผิดพลาด",
        });
      }
      // Insert Company
      const addCompany = await addDataCompanyMutation.mutateAsync({
        token: session?.user.accessToken,
        companyData: {
          name: values.name,
          address: values.address,
          email: values.email,
          phone: values.phone,
          tax: values.tax,
          logo: "",
          status: values.status,
        },
        setLoadingQuery: setLoadingQuery,
      });

      if (addCompany === null)
        return showMessage({
          status: "error",
          text: "เพิ่มข้อมูลบริษัทไม่สำเร็จ กรุณาลองอีกครั้ง",
        });
      if (addCompany?.status === true) {
        setTimeout(() => {
          onClick();
        }, 1500);
        return showMessage({
          status: "success",
          text: "เพิ่มข้อมูลบริษัทสำเร็จ",
        });
      }
      if (typeof addCompany.message !== "string")
        setMessageError(addCompany.message);
      return showMessage({
        status: "error",
        text: "เพิ่มข้อมูลบริษัทไม่สำเร็จ กรุณาแก้ไขข้อผิดพลาด",
      });
    } catch (error: unknown) {
      console.error("Failed to add data:", error);
    }
  };

  const showMessage = ({ status, text }: { status: string; text: string }) => {
    if (status === "success") {
      messageApi.success(text);
    } else if (status === "error") {
      messageApi.error(text);
    } else if (status === "warning") {
      messageApi.warning(text);
    }
  };

  useEffect(() => {
    function loadComponents() {
      if (loadingQuery > 0) {
        dispatch(
          setLoading({ loadingAction: loadingQuery, showLoading: true })
        );
      }
    }

    loadComponents();
  }, [loadingQuery]);

  const MyForm = (): React.JSX.Element => {
    return (
      <Form
        layout="vertical"
        onFinish={(values) => {
          setFormValues(values as companySubmit);
          handleSubmit(values as companySubmit);
        }}
        initialValues={formValues}
      >
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
          <InputFrom label="อีเมล์" name="email" required={true} type="email" />
          <InputFrom
            label="เบอร์โทรศัพท์"
            name="phone"
            required={true}
            type="text"
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
      {contextHolder}
      <DrawerActionData
        resetForm={resetForm}
        formContent={<MyForm />}
        title={title}
        showError={messageError}
        statusAction={statusAction}
      />
    </div>
  );
};

export default CompanyFrom;
