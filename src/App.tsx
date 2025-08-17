import "./index.css";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Reset from "./pages/reset_password";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import News from "./pages/news";
import Forgot from "./pages/forgot_password";
import League from "./pages/league";
import { ThemeProvider } from "./ThemeContext";
import ScrollToTop from "./ScrollToTop";
import Navigation from "./components/dasboardelements/Navigation";

// Animation variants (can tweak)
const pageVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.05 },
};


function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="sync">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/login"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <Login />
            </motion.div>
          }
        />
        <Route
          path="/signup"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <Signup />
            </motion.div>
          }
        />
        <Route
          path="/league"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <League />
            </motion.div>
          }
        />
        <Route
          path="/"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <Dashboard />
            </motion.div>
          }
        />
        <Route
          path="/news"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <News />
            </motion.div>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <Forgot />
            </motion.div>
          }
        />
        <Route
          path="/reset-password"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <Reset />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <ScrollToTop />
        <AnimatedRoutes />
        <Navigation />
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
