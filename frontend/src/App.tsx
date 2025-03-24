import {GlobalStyle} from "./styles/globalStyle.ts";
import {Router} from "./router.tsx";
import {BrowserRouter} from "react-router-dom";
import {ToastContainer} from "react-toastify";

function App() {

  return (
    <>
        <GlobalStyle/>
        <BrowserRouter>
            <ToastContainer
                position="top-center"
            />
            <Router/>
        </BrowserRouter>
    </>
  )
}

export default App
