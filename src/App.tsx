import "./styles/index.css";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  type Transition,
} from "framer-motion";

import Dashboard from "./features/dashboard/pages/dashboard";
import News from "./features/dashboard/pages/news";
import { League } from "./features/dashboard/pages/league";
import { ThemeProvider } from "./context/ThemeContext";
import ScrollToTop from "./ScrollToTop";
import Navigation from "./components/layout/Navigation";
import { setNavigator } from "./lib/router/navigate";
import { useEffect, lazy, Suspense } from "react";

const Reset = lazy(() => import("./features/auth/pages/reset_password"));
const Forgot = lazy(() => import("./features/auth/pages/forgot_password"));
const Favourite = lazy(() => import("./features/dashboard/pages/favourites"));
const AccountPage = lazy(() => import("./features/account/pages/account"));
const GameInfo = lazy(() => import("./features/football/pages/gameInfo"));
const PlayerProfile = lazy(
  () => import("./features/football/pages/playerProfile"),
);
const PlayerComparison = lazy(
  () => import("./features/football/pages/playerComparison"),
);
const TeamProfile = lazy(() => import("./features/football/pages/teamProfile"));
const LeagueProfile = lazy(
  () => import("./features/football/pages/leagueProfile"),
);
const Onboard = lazy(() => import("./features/onboarding/pages/onboard"));
const Afcon = lazy(() => import("./features/football/pages/afcon"));
const NewsRead = lazy(() => import("./features/news/pages/read"));
const ScriptSandbox = lazy(() => import("./features/dev/pages/ScriptSandbox"));
const PrivacyPolicy = lazy(() => import("./features/legal/pages/privacyPolicy"));
const BasketballPage = lazy(() => import("./features/basketball/pages/basketBall"));
const BasketballMatchDetail = lazy(() => import("./features/basketball/pages/basketBallMatchDetail"));
const Community = lazy(() => import("./features/community/pages/Community"));
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

  const motionVariants = pageVariants;
  const motionTransition: Transition = {
    duration: 0.4,
    ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
  };

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence mode="sync">
        <Suspense fallback={<div className="p-6">Loading...</div>}>
          <Routes location={location} key={location.pathname}>
            {/* No Navigation */}
            <Route path="/login" element={<Onboard />} />
            <Route path="/signup" element={<Onboard />} />

            {/* With Navigation */}
            <Route
              path="/league"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <League />
                </m.div>
              }
            />

            <Route
              path="/league/profile"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <LeagueProfile />
                </m.div>
              }
            />
            <Route
              path="/league/profile/:leagueId"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <LeagueProfile />
                </m.div>
              }
            />
            <Route
              path="/news/read/:id"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <NewsRead id={""} initialPost={null} initialError={null} />
                </m.div>
              }
            />
            <Route
              path="/onboard"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <Onboard />
                </m.div>
              }
            />
            <Route
              path="/"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <Dashboard />
                </m.div>
              }
            />
            <Route
              path="/news"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <News />
                </m.div>
              }
            />
            <Route
              path="/football/afcon"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <Afcon />
                </m.div>
              }
            />
            <Route
          path="/basketball"
          element={
            <m.div
              variants={motionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={motionTransition}
            >
              <BasketballPage />
            </m.div>
          }
            />
            <Route
          path="/basketball/match/:matchId"
          element={
            <m.div
              variants={motionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={motionTransition}
            >
              <BasketballMatchDetail />
            </m.div>
          }
            />
            <Route
              path="/account"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <AccountPage />
                </m.div>
              }
            />
            <Route
              path="/player/profile"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <PlayerProfile />
                </m.div>
              }
            />
            <Route
              path="/player/profile/:playerId"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <PlayerProfile />
                </m.div>
              }
            />

            <Route
              path="/player/compare"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <PlayerComparison />
                </m.div>
              }
            />

            <Route
              path="/team/profile"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <TeamProfile />
                </m.div>
              }
            />
            <Route
              path="/team/profile/:teamId"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <TeamProfile />
                </m.div>
              }
            />
            <Route
              path="/football/gameinfo/:fixtureId"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <GameInfo />
                </m.div>
              }
            />
            <Route
              path="/test"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <ScriptSandbox />
                </m.div>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <Forgot />
                </m.div>
              }
            />
            <Route
              path="/reset-password"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <Reset />
                </m.div>
              }
            />
            <Route
              path="/favourites"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <Favourite />
                </m.div>
              }
            />

            <Route
              path="/privacy-policy"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <PrivacyPolicy />
                </m.div>
              }
            />
            <Route
              path="/community"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <Community />
                </m.div>
              }
            />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </LazyMotion>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const hideNavOn = ["/login", "/signup"];

  const shouldHideNav = hideNavOn.includes(location.pathname);

  return (
    <>
      {!shouldHideNav && <Navigation />}
      <main>{children}</main>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
