import styled from "styled-components";
import { Button, Drawer } from "antd";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.colors.background};

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenuButton = styled(Button)`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <StyledHeader>
      <Logo>
        <img
          alt="Logo"
          src="/Logo%20Sound%20Share%20Sem%20fundo.png"
          width="200"
        />
      </Logo>
      <Nav>
        <Button type="link">Features</Button>
        <Button type="link">Testimonials</Button>
        <Link to="/login">
          {" "}
          <Button type="primary">Login</Button>
        </Link>
        <Link to="/sign-up">
          <Button type="primary">Sign Up</Button>
        </Link>
      </Nav>
      <MobileMenuButton
        icon={<Menu />}
        onClick={() => setMobileMenuOpen(true)}
      />
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
      >
        <MobileNav>
          <Button type="link">Features</Button>
          <Button type="link">Testimonials</Button>
          <Link to="/login">
            {" "}
            <Button type="primary">Login</Button>
          </Link>
          <Link to="/sign-up">
            <Button type="primary">Sign Up</Button>
          </Link>
        </MobileNav>
      </Drawer>
    </StyledHeader>
  );
}
