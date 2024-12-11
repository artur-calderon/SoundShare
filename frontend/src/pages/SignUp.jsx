import { useState } from "react";
import { Button, Typography, Flex, Form, Input, Layout } from "antd";
import { userContext } from "../contexts/zustand-context/UserContext.js";
import Alert from "../components/Alert.jsx";

const boxStyle = {
  width: "50%",
  height: "100%",
};

function SignUp() {
  const { Title } = Typography;
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { createUser, statusMessage } = userContext((store) => {
    return {
      createUser: store.createUser,
      statusMessage: store.statusMessage,
    };
  });

  async function singUP(data) {
    setConfirmLoading(true);
    await createUser(data);
    setConfirmLoading(false);
    form.resetFields();
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  const { Content } = Layout;
  return (
    <Layout>
      <Content
        style={{
          padding: "2rem",
          height: "100vh",
          display: "flex",
        }}
      >
        {statusMessage && (
          <Alert msm={statusMessage.message} type={statusMessage.type} />
        )}
        <Layout>
          <Content
            style={{
              minHeight: 280,
              backgroundColor: "#FFF",
              borderRadius: 7,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Flex
              style={boxStyle}
              justify="center"
              align="center"
              vertical="horizontal"
            >
              <img alt="Logo" src="/Icone%20Music%20Share.svg" width="80rem" />

              <Title style={{ fontWeight: "bold" }}>
                Sign Up To Music Share
              </Title>
              <Form
                {...formItemLayout}
                form={form}
                name="register"
                onFinish={singUP}
                initialValues={{
                  residence: ["zhejiang", "hangzhou", "xihu"],
                  prefix: "86",
                }}
                style={{ maxWidth: 600, width: "50%" }}
                scrollToFirstError
              >
                <Form.Item
                  name="email"
                  label="E-mail"
                  rules={[
                    {
                      type: "email",
                      message: "The input is not valid E-mail!",
                    },
                    {
                      required: true,
                      message: "Please input your E-mail!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  name="confirm"
                  label="Confirm Password"
                  dependencies={["password"]}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "The new password that you entered do not match!",
                          ),
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  name="name"
                  label="Nickname"
                  tooltip="What do you want others to call you?"
                  rules={[
                    {
                      required: true,
                      message: "Please input your nickname!",
                      whitespace: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Flex gap="middle" align="center" justify="center">
                  <Form.Item>
                    <Button
                      block
                      type="primary"
                      htmlType="submit"
                      style={{ width: "10rem" }}
                      loading={confirmLoading}
                    >
                      Sign Up
                    </Button>
                  </Form.Item>{" "}
                </Flex>
              </Form>
            </Flex>
            <div
              style={{
                width: "50%",
                height: "100%",
                backgroundColor: "#FAF5FF",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img
                alt="signup illustration"
                src="../../assets/signup%20illustration.svg"
                width="50%"
              />
            </div>
          </Content>
        </Layout>
      </Content>
    </Layout>
  );
}

export default SignUp;
