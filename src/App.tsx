import "./styles/index.css";
import {
  HashRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Reset from "./features/auth/pages/reset_password";
import Dashboard from "./features/dashboard/pages/dashboard";
import News from "./features/dashboard/pages/news";
import Forgot from "./features/auth/pages/forgot_password";
import { League } from "./features/dashboard/pages/league";
import Favourite from "./features/dashboard/pages/favourites";
import { ThemeProvider } from "./context/ThemeContext";
import ScrollToTop from "./ScrollToTop";
import Navigation from "./components/layout/Navigation";
import GameInfo from "./features/football/pages/gameInfo";
import { setNavigator } from "./lib/router/navigate";
import { useEffect } from "react";
import PlayerProfile from "./features/football/pages/playerProfile";
import Onboard from "./features/onboarding/pages/onboard";
// Animation variants (can tweak)
const pageVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.05 },
};

function AnimatedRoutes() {
  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    setNavigator(navigate); // store global navigate
  }, [navigate]);

  return (
    <AnimatePresence mode="sync">
      <Routes location={location} key={location.pathname}>
        {/* No Navigation */}
        <Route path="/login" element={<Onboard />} />
        <Route path="/signup" element={<Onboard />} />

        {/* With Navigation */}
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
          path="/onboard"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <Onboard />
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
          path="/profile"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <PlayerProfile />
            </motion.div>
          }
        />
        <Route
          path="/overview"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <GameInfo />
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
        <Route
          path="/favourites"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <Favourite />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const hideNavOn = ["/login", "/signup"];

  const shouldHideNav = hideNavOn.includes(location.pathname);

  return (
    <>
      {!shouldHideNav && <Navigation />}
      {children}
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <ScrollToTop />
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
