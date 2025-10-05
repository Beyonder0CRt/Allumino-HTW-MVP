import { Routes, Route } from "react-router-dom";
import AlluminoLanding from "./AlluminoLanding.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";   // ← NEW

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AlluminoLanding />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} /> {/* ← NEW */}
    </Routes>
  );
}

