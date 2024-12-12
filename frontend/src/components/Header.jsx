import { Layout } from "antd";

function Header() {
  const { Header } = Layout;
  return (
    <Header
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <img
        alt="Logo"
        src="/Logo%20Sound%20Share%20Sem%20fundo.png"
        width="150"
      />
    </Header>
  );
}

export default Header;
