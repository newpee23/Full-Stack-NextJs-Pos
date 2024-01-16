
"use client";
// Import Next
import { useEffect, useState } from "react";
import { SignInResponse, signIn, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation'
// Import antd
import { Button, Card, Form, Input, message } from "antd";
import { KeyOutlined, LoginOutlined, UserOutlined } from "@ant-design/icons";

type FieldType = {
  username?: string;
  password?: string;
};
const key = 'loadingMessageKey';

const SignIn = () => {

  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLogin , setIsLogin] = useState<boolean>(false);
  
  const handleSubmit = async (username: string, password: string) => {
    try {
      showMessageApi("loading","Loading...");
      const response: SignInResponse | undefined = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (response?.status === 401) {
        setIsLogin(false);
        return showMessageApi("error", "ไม่พบข้อมูล Username และ Password");
      }else{
        router.push('/customerCloud', { scroll: false })
      }

    } catch (error) {
      console.log(error);
      router.refresh();
    } finally {
        messageApi.destroy(key);
    }
  };

  const onFinish = async (values: { username: string, password: string }) => {
    setIsLogin(true);
    await handleSubmit(values.username, values.password);
  };

  const onFinishFailed = () => {
    showMessageApi("error", "เกิดข้อผิดพลาดกรุณากรอกข้อมูลให้ครบ");
  };

  const showMessageApi = (type: string, content: string) => {
    if (type === "error") messageApi.open({ type: 'error', content: content, duration: 4 });
    if (type === "success") messageApi.open({ type: 'success', content: content, duration: 2, });
    if (type === "loading") messageApi.open({ key, type: 'loading', content: content, duration: 0 });
  }

  useEffect(() => {
    return () => router.refresh();
  }, []);

  return (
    <section className="flex min-h-screen flex-col items-center justify-center xs:p-5 p-24 bg-background">
      <Card className="drop-shadow-lg w-[350px] rounded-2xl p-5">
        <div className="relative">
          <div className="absolute top-[-70px] left-[110px] drop-shadow-lg w-[90px] h-[90px] rounded-full flex justify-center bg-btn-orange text-white">
            <LoginOutlined className="text-4xl" />
          </div>
        </div>

        <Form name="basic" className="mt-14" autoComplete="off" onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <Form.Item<FieldType> name="username" rules={[{ required: true, message: "กรุณากรอก username!" }]}>
            <Input size="large" placeholder="Username" prefix={<UserOutlined className="text-orange-700" />} />
          </Form.Item>
          <Form.Item<FieldType> name="password" className="mb-10" rules={[{ required: true, message: "กรุณากรอก password!" }]}>
            <Input.Password size="large" placeholder="Password" prefix={<KeyOutlined className="text-orange-700" />} />
          </Form.Item>
          <div className="relative">
            <Form.Item wrapperCol={{ offset: 8, span: 16 }} className="mb-0 absolute w-[250px] left-[29px]">
              <Button disabled={isLogin} className="bg-btn-orange text-lg hover:bg-orange-500 w-full sml:w-[150%] text-white h-11 rounded-2xl drop-shadow-lg" htmlType="submit">
                SIGNIN
              </Button>
            </Form.Item>
          </div>
        </Form>

        {contextHolder}
      </Card>
    </section>
  );
};

export default SignIn;