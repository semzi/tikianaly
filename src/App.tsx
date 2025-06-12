import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Reset from "./pages/reset_password";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import Forgot from "./pages/forgot_password";
import { ThemeProvider } from "./ThemeContext";

function App() {
  return (
    <ThemeProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/forgot-password" element={<Forgot />} />
        <Route path="/reset-password" element={<Reset />} />
      </Routes>
    </Router>
  </ThemeProvider>
  );
}

export default App;
