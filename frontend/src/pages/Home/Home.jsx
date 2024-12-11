import { ConfigProvider, Layout } from "antd";
import { Link } from "react-router-dom";
import { HeroSection, Menu, FeatureSection } from "./styles.js";
import Lottie from "lottie-react";
import notesAnimation from "../../../assets/Animation_Girl_Music.json";

function Home() {
  const { Header, Content, Footer } = Layout;
  return (
    <ConfigProvider
      theme={{
        Components: {
          Menu: {
            itemColor: "#FFF",
            itemBg: "red",
          },
          Layout: {
            headerBg: "#FFF",
          },
        },
      }}
    >
      <Layout>
        <Header
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            height: "5rem",
            backgroundColor: "#FFF",
          }}
        >
          <img
            alt="Logo"
            src="../../../assets/Logo%20Sound%20Share%20Sem%20fundo.png"
            width="200rem"
            align="center"
          />
          <Menu>
            <ul>
              <Link to="/">About</Link>
              <Link to="/">Pricing</Link>
              <Link to="/">Contact Us</Link>
            </ul>
            <Link to="/login">Login</Link>
            <Link to="/sign-up" className="signup">
              Sign Up
            </Link>
          </Menu>
        </Header>
        <Content>
          <Layout>
            <Content
              style={{
                minHeight: 280,
                backgroundColor: "#fff",
                padding: "0 225px",
              }}
            >
              <HeroSection>
                <div className="text">
                  <h1>Compartilhe sua Música. Conecte-se pelo Som</h1>
                  <h3>
                    Crie salas de música, convide amigos e ouça juntos em tempo
                    real, onde quer que estejam.
                  </h3>
                  <div className="cadastre">
                    <h2>Crie sua Sala Agora!</h2>
                    <Link to="/sign-up" className="signup">
                      Sign Up
                    </Link>
                  </div>
                </div>
                <div className="animation">
                  <Lottie animationData={notesAnimation} />
                </div>
              </HeroSection>
              <FeatureSection>
                <h1>Como o Music Share transforma a forma de ouvir Música?</h1>
              </FeatureSection>
            </Content>
          </Layout>
        </Content>
        <Footer
          style={{
            padding: "0 225px",
            backgroundColor: "#fff",
          }}
        >
          MusicShare ©{new Date().getFullYear()} Created by Artur Calderon
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}

export default Home;
