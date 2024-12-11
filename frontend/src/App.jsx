import { BrowserRouter } from "react-router-dom";

import Router from "./Router.jsx";

import { GlobalStyle } from "./globalStyle.js";

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Router></Router>
    </BrowserRouter>
  );
}

export default App;
