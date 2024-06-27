import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Invoice from "./Invoice";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/invoice/:invoiceId" element={<Invoice />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
