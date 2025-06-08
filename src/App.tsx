import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Reset from "./pages/reset_password";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import Forgot from "./pages/forgot_password";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<Forgot />} />
        <Route path="/reset-password" element={<Reset />} />
      </Routes>
    </Router>
  );
}

export default App;
