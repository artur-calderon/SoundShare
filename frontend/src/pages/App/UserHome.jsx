import { Layout, Menu, Modal } from "antd";
import { menuItems } from "./menuItens.jsx";
import { Outlet, useNavigate } from "react-router-dom";
import { Container, SiderC } from "./styles.js";
import { useEffect, useState } from "react";
import { userContext } from "../../contexts/zustand-context/UserContext.js";

export default function UserHome() {
  const { Content, Footer } = Layout;
  const { isLogged, user, signOut } = userContext((store) => {
    return {
      user: store.user,
      signOut: store.signOut,
      isLogged: store.isLogged,
    };
  });
  const navigate = useNavigate();

  useEffect(() => {
    const insideRoom = localStorage.getItem("insideRoom");
    if (insideRoom) {
      navigate(insideRoom, { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (!isLogged) {
      Modal.info({
        title: "User not logged in",
      });
      navigate("/login");
    }
  }, [isLogged, navigate]);

  function handleMenuClick(click) {
    const { key } = click;
    switch (key) {
      case "sair":
        signOut();
        break;
      case "myRooms":
        navigate("/app/myrooms");
        break;
      case "salas":
        navigate("/app");
        break;
      case "profile":
        navigate("/app/profile");
        break;
    }
  }

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <SiderC>
        <div className="demo-logo-vertical">
          <img
            alt="logo"
            src="../../../assets/Logo%20Sound%20Share%20Sem%20fundo.png"
            width="150"
          />
        </div>
        <div className="userInfo">
          <b>Bem vindo {user.name}</b>
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={menuItems}
          onClick={handleMenuClick}
        />
      </SiderC>
      <Layout>
        <Content
          style={{
            margin: "0 16px",
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 360,
            }}
          >
            <Container>
              <Outlet />
            </Container>
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Music Share ©{new Date().getFullYear()} Calderon Tecnologia
        </Footer>
      </Layout>
    </Layout>
  );
}
