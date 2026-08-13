import { Routes, Route } from "react-router-dom";
import "./App.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";
import Home from "./pages/Home";
import Programs from "./pages/Programs";
import ProgramDetail from "./pages/ProgramDetail";
import LegalPage from "./pages/LegalPage";
import Institutions from "./pages/Institutions";

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/programs/:slug" element={<ProgramDetail />} />
        <Route path="/institutions" element={<Institutions />} />
        <Route path="/privacy-policy" element={<LegalPage />} />
<Route path="/refund-policy" element={<LegalPage />} />
<Route path="/terms-and-conditions" element={<LegalPage />} />
<Route path="/terms-of-use" element={<LegalPage />} />
<Route path="/privacy-policy" element={<LegalPage slug="privacy-policy" />} />
<Route path="/refund-policy" element={<LegalPage slug="refund-policy" />} />
<Route path="/terms-and-conditions" element={<LegalPage slug="terms-and-conditions" />} />
<Route path="/terms-of-use" element={<LegalPage slug="terms-of-use" />} />
      </Routes>
      <Footer />
      <ChatWidget />
    </>
  );
}
export default App;