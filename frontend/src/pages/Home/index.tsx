import {Header} from "./components/Header";
import {ThemeProvider} from "styled-components";
import {ConfigProvider} from "antd";
import {HeroSection} from "./components/HeroSection";
import {defaultThemeColors} from "../../styles/themes/default.ts";
import {Features} from "./components/Features";
import {Testimonials} from "./components/Testimonials";
import {Download} from "./components/Donwload";
import {Benefits} from "./components/Benefits";
import {VideoDemo} from "./components/VideoDemo";
import {FAQ} from "./components/FAQ";
import {Footer} from "./components/Footer";


export function Home(){
	return(
		<ThemeProvider theme={defaultThemeColors}>
			<ConfigProvider
				theme={{
					token: {
						colorPrimary: "#f5c249",
					},
				}}
			>
				<main>
					<Header/>
					<HeroSection/>
					<Features/>
					<Testimonials/>
					<Download/>
					<Benefits/>
					<VideoDemo/>
					<FAQ/>
				</main>
				<Footer/>
			</ConfigProvider>
		</ThemeProvider>
	)
}