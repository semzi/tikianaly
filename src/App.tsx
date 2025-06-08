
import "./index.css";
import Reset from "./pages/reset_password";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import Forgot from "./pages/forgot_password";

function App() {
  return (
    <>
      {/* <h1 className=" text-2xl font-bold">
        Tiki<span className="text-blue-500">Analy</span>
      </h1> */}
      <Dashboard />
    </>
  );
}

export default App;
