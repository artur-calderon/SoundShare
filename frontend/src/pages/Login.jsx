import { Link, Navigate, useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Flex, Form, Input, Layout, Space } from "antd";
import { userContext } from "../contexts/zustand-context/UserContext.js";
import { useEffect } from "react";
import { Loading } from "../components/Loading.jsx";
import Alert from "../components/Alert.jsx";

const boxStyle = {
  width: "50%",
  height: "100%",
};

function Login() {
  const { Content } = Layout;
  const {
    loginWithGoogle,
    loginLoad,
    loginWithEmailAndPassword,
    isLogged,
    persistUserLogged,
    statusMessage,
  } = userContext((store) => {
    return {
      loginWithEmailAndPassword: store.loginWithEmailAndPassword,
      isLogged: store.isLogged,
      persistUserLogged: store.persistUserLogged,
      loginLoad: store.loginLoad,
      loginWithGoogle: store.loginWithGoogle,
      statusMessage: store.statusMessage,
    };
  });

  const navigate = useNavigate()

  useEffect(()=>{
    if(isLogged){
      navigate('/app')
    }
  },[])

  //
  useEffect(() => {
    persistUserLogged();
  }, []);

  const onFinish = (values) => {
    const { email, password } = values;
    loginWithEmailAndPassword(email, password);
  };
  if (loginLoad) {
    return <Loading />;
  }

  return (
    <Layout>
      {Object.hasOwn(statusMessage, "message") && (
        <Alert msm={statusMessage.message} type={statusMessage.type} />
      )}
      <Content
        style={{
          padding: "2rem",
          height: "100vh",
          display: "flex",
        }}
      >
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
              <Space>
                <img
                  alt="Logo Music Share"
                  src="/Logo%20Sound%20Share%20Sem%20fundo.png"
                  width="300"
                  style={{
                    marginBottom: "5rem",
                  }}
                />
              </Space>
              <Form
                name="login"
                initialValues={{
                  remember: true,
                }}
                style={{
                  maxWidth: 360,
                }}
                onFinish={onFinish}
              >
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email!",
                    },
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Username" />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Password!",
                    },
                  ]}
                >
                  <Input
                    prefix={<LockOutlined />}
                    type="password"
                    placeholder="Password"
                  />
                </Form.Item>
                <Form.Item>
                  <Flex justify="space-between" align="center">
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                      <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                    <br /> <a href="">Forgot password</a>
                  </Flex>
                </Form.Item>

                <Form.Item>
                  <Button
                    block
                    type="primary"
                    htmlType="submit"
                    loading={loginLoad}
                  >
                    Log in
                  </Button>
                  <Button
                    block
                    style={{ marginTop: "1rem" }}
                    onClick={() => loginWithGoogle()}
                    loading={loginLoad}
                  >
                    Logar com o Google
                  </Button>
                  or <Link to="/sign-up">Register now!</Link>
                </Form.Item>
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
                src="/Login_ILLustration.svg"
                width="50%"
              />
            </div>
          </Content>
        </Layout>
      </Content>
    </Layout>
  );
}

export default Login;
