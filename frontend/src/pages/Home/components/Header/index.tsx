import {useState} from "react";

import {Logo, MobileMenuButton, MobileNav, Nav, StyledHeader,} from './styles.ts'

import {Button, Drawer} from "antd";
import { Link } from "react-router-dom";
import { Menu } from 'lucide-react'


export function Header() {
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
				<Link to="/signup">
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
