import { ThemeProvider } from "styled-components";
import { ConfigProvider } from "antd";
import Header from "./Header/Header.jsx";
import HeroSection from "./HeroSection/HeroSection.jsx";
import Features from "./Features/Features.jsx";
import Testimonials from "./Testimonials/Testimonials.jsx";
import DownloadCTA from "./DownloadCTA/DownloadCTA.jsx";
import Benefits from "./Benefits/Benefits.jsx";
import VideoDemo from "./VideoDemo/VideoDemo.jsx";
import FAQ from "./FAQ/FAQ.jsx";
import Integrations from "./Integrations/Integrations.jsx";
import Footer from "./Footer/Footer.jsx";

const theme = {
  colors: {
    primary: "#f5c249",
    secondary: "#191414",
    background: "#FFFFFF",
    text: "#333333",
  },
  fonts: {
    body: "'Inter', sans-serif",
    heading: "'Poppins', sans-serif",
  },
};

function Home() {
  return (
    <ThemeProvider theme={theme}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#f5c249",
          },
        }}
      >
        <Header />
        <main>
          <HeroSection />
          <Features />
          <Testimonials />
          <DownloadCTA />
          <Benefits />
          <VideoDemo />
          <FAQ />
          <Integrations />
        </main>
        <Footer />
      </ConfigProvider>
    </ThemeProvider>
    // <Layout>
    //   <HeaderC open={openMenu}>
    //     <img
    //       alt="Logo"
    //       src="../../../assets/Logo%20Sound%20Share%20Sem%20fundo.png"
    //       width="200rem"
    //       align="center"
    //     />
    //     <Menu className="mobileMenu" onClick={() => setOpenMenu(!openMenu)} />
    //     <MenuMobile>
    //       <X
    //         size={32}
    //         color="black"
    //         className="closeBtn"
    //         onClick={() => setOpenMenu(!openMenu)}
    //       />
    //       <ul>
    //         <Link to="/">
    //           {" "}
    //           <li>About</li>
    //         </Link>
    //         <Link to="/">
    //           {" "}
    //           <li>Pricing</li>
    //         </Link>
    //         <Link to="/">
    //           <li>Contact Us</li>
    //         </Link>
    //       </ul>
    //       <Link to="/login">Login</Link>
    //       <Link to="/sign-up" className="signup">
    //         Sign Up
    //       </Link>
    //     </MenuMobile>
    //     <MenuDesktop>
    //       <ul>
    //         <Link to="/">About</Link>
    //         <Link to="/">Pricing</Link>
    //         <Link to="/">Contact Us</Link>
    //       </ul>
    //       <Link to="/login">Login</Link>
    //       <Link to="/sign-up" className="signup">
    //         Sign Up
    //       </Link>
    //     </MenuDesktop>
    //   </HeaderC>
    //   <Content>
    //     <Layout>
    //       <ContainerContent>
    //         <HeroSection>
    //           <div className="text">
    //             <h1>Compartilhe sua Música. Conecte-se pelo Som</h1>
    //             <h6>
    //               Crie salas de música, convide amigos e ouça juntos em tempo
    //               real, onde quer que estejam.
    //             </h6>
    //             <div className="cadastre">
    //               <h3>Crie sua Sala Agora!</h3>
    //               <Link to="/sign-up" className="signup">
    //                 Sign Up
    //               </Link>
    //             </div>
    //           </div>
    //           <div className="animation">
    //             <Lottie animationData={notesAnimation} />
    //           </div>
    //         </HeroSection>
    //         <FeatureSection>
    //           <h1>Como o Music Share transforma a forma de ouvir Música?</h1>
    //         </FeatureSection>
    //       </ContainerContent>
    //     </Layout>
    //   </Content>
    //   <FooterContainer>
    //     <p>MusicShare ©{new Date().getFullYear()} Created by Artur Calderon</p>
    //   </FooterContainer>
    // </Layout>
  );
}

export default Home;
