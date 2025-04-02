"use client";

import { sendRequest } from "@/utils/api";
import { useHasMounted } from "@/utils/customHook";
import {
  LoadingOutlined,
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Modal, notification, Steps } from "antd";
import { useEffect, useState } from "react";

const ModalReactive = (props: any) => {
  const { isModalOpen, setIsModalOpen, userEmail } = props;
  const hasMounted = useHasMounted();
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [userId, setUserId] = useState("");
  useEffect(() => {
    if (userEmail) {
      form.setFieldValue("email", userEmail);
    }
  }, [userEmail]);
  if (!hasMounted) return <></>;
  const onFinishStep0 = async (values: any) => {
    const { email } = values;
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/retry-active`,
      method: "POST",
      body: {
        email,
      },
    });
    if (res?.data) {
      setUserId(res?.data?._id);
      setCurrent(1);
    } else {
      notification.error({
        message: "Call APIs error",
        description: res?.error,
      });
    }
  };
  const onFinishStep1 = async (values: any) => {
    const { code } = values;
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/check-code`,
      method: "POST",
      body: {
        _id: userId,
        code,
      },
    });
    if (res?.data) {
      setUserId(res?.data?._id);
      setCurrent(2);
    } else {
      notification.error({
        message: "Call APIs error",
        description: res?.error,
      });
    }
  };
  return (
    <>
      <Modal
        title="Kích hoạt tài khoản"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        maskClosable={false}
        footer={null}
      >
        <Steps
          current={current}
          items={[
            {
              title: "Login",
              //   status: "finish",
              icon: <UserOutlined />,
            },
            {
              title: "Verification",
              //   status: "finish",
              icon: <SolutionOutlined />,
            },
            {
              title: "Done",
              //   status: "wait",
              icon: <SmileOutlined />,
            },
          ]}
        />
        {current === 0 && (
          <>
            <div style={{ margin: "20px 0" }}>
              <p>Tài khoản của bạn chưa được kích hoạt</p>
            </div>
            <Form
              name="verify"
              onFinish={onFinishStep0}
              autoComplete="off"
              layout="vertical"
              form={form}
            >
              <Form.Item
                label="Email"
                name="email"

                // rules={[
                //   {
                //     required: true,
                //     message: "Please input your email!",
                //   },
                // ]}
              >
                <Input value={userEmail} disabled />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Resend
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
        {current === 1 && (
          <>
            <div style={{ margin: "20px 0" }}>
              <p>Vui lòng nhập mã xác thực</p>
            </div>
            <Form
              name="verify"
              onFinish={onFinishStep1}
              autoComplete="off"
              layout="vertical"
              form={form}
            >
              <Form.Item
                label="Code"
                name="code"
                rules={[
                  {
                    required: true,
                    message: "Please input your code!",
                  },
                ]}
              >
                <Input value={userEmail} disabled />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Active
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
        {current === 2 && (
          <>
            <div style={{ margin: "20px 0" }}>
              <p>
                Tài khoản của bạn đã được kích hoạt thành công. Vui Lòng đăng
                nhập lại
              </p>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default ModalReactive;
