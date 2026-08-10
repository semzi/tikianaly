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
import { useEffect, useState, lazy, Suspense } from "react";
import Lottie from "lottie-react";
// import { BackendStatusProvider } from "@/context/BackendStatusContext";
// import { BackendStatusBanner } from "@/components/layout/BackendStatusBanner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

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
const SseDebug = lazy(() => import("./features/dev/pages/SseDebug"));
const PrivacyPolicy = lazy(
  () => import("./features/legal/pages/privacyPolicy"),
);
const TermsAndConditions = lazy(
  () => import("./features/legal/pages/terms"),
);
const BasketballPage = lazy(
  () => import("./features/basketball/pages/basketBall"),
);

// Splash screen loading animation component
const SplashLottie = () => {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch("/splash-screen/Spalsh-Screen.json")
      .then((res) => res.json())
      .then(setAnimationData)
      .catch((err) => console.error("Failed to load splash animation:", err));
  }, []);

  if (!animationData) return null;
  return (
    <Lottie animationData={animationData} loop className="w-48 h-48 mx-auto" />
  );
};

const BasketballMatchDetail = lazy(
  () => import("./features/basketball/pages/basketBallMatchDetail"),
);
const BasketballLeagueProfile = lazy(
  () => import("./features/basketball/pages/BasketballLeagueProfile"),
);
const BasketballLeagues = lazy(
  () => import("./features/basketball/pages/BasketballLeagues"),
);
const BasketballPlayerProfile = lazy(
  () => import("./features/basketball/pages/BasketballPlayerProfile"),
);
const CricketPage = lazy(() => import("./features/cricket/pages/Cricket"));
const CricketLeagues = lazy(
  () => import("./features/cricket/pages/CricketLeagues"),
);
const CricketLeagueProfile = lazy(
  () => import("./features/cricket/pages/CricketLeagueProfile"),
);
const CricketGameInfo = lazy(
  () => import("./features/cricket/pages/CricketGameInfo"),
);
const AmericanFootballPage = lazy(
  () => import("./features/american-football/pages/AmericanFootball"),
);
const AmericanFootballMatchDetail = lazy(
  () =>
    import("./features/american-football/pages/AmericanFootballMatchDetail"),
);

const AmericanFootballLeagueProfile = lazy(
  () =>
    import("./features/american-football/pages/AmericanFootballLeagueProfile"),
);
const TennisPage = lazy(() => import("./features/tennis/pages/Tennis"));
const TennisGame = lazy(() => import("./features/tennis/pages/TennisGame"));
const TennisSeries = lazy(() => import("./features/tennis/pages/TennisSeries"));
const TennisPlayerProfile = lazy(
  () => import("./features/tennis/pages/TennisPlayerProfile"),
);
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
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen bg-brand-primary">
              <SplashLottie />
            </div>
          }
        >
          <Routes location={location} key={location.pathname}>
            {/* No Navigation */}
            <Route path="/login" element={<Onboard />} />
            <Route path="/signup" element={<Onboard />} />

            {/* With Navigation */}
            <Route
              path="/football"
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
              path="/basketball/leagues"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <BasketballLeagues />
                </m.div>
              }
            />
            <Route
              path="/basketball/league/:leagueId"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <BasketballLeagueProfile />
                </m.div>
              }
            />
            <Route
              path="/basketball/player/:playerId"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <BasketballPlayerProfile />
                </m.div>
              }
            />
            <Route
              path="/cricket"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <CricketPage />
                </m.div>
              }
            />
            <Route
              path="/cricket/leagues"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <CricketLeagues />
                </m.div>
              }
            />
            <Route
              path="/cricket/league/:leagueId"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <CricketLeagueProfile />
                </m.div>
              }
            />
            <Route
              path="/cricket/match/:matchId"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <CricketGameInfo />
                </m.div>
              }
            />
            <Route
              path="/american-football"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <AmericanFootballPage />
                </m.div>
              }
            />
            <Route
              path="/american-football/match/:matchId"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <AmericanFootballMatchDetail />
                </m.div>
              }
            />
            <Route
              path="/american-football/league/:leagueId"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <AmericanFootballLeagueProfile />
                </m.div>
              }
            />
            <Route
              path="/tennis"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <TennisPage />
                </m.div>
              }
            />
            <Route
              path="/tennis/game/:matchId"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <TennisGame />
                </m.div>
              }
            />
            <Route
              path="/tennis/series/:seriesId"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <TennisSeries />
                </m.div>
              }
            />
            <Route
              path="/tennis/player/:playerId"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <TennisPlayerProfile />
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
              path="/dev/sse"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <SseDebug />
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
              path="/terms"
              element={
                <m.div
                  variants={motionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={motionTransition}
                >
                  <TermsAndConditions />
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
      {/* <BackendStatusBanner /> */}
      {!shouldHideNav && <Navigation />}
      <main>{children}</main>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {/* <BackendStatusProvider> */}
        <BrowserRouter>
          <ScrollToTop />
          <Layout>
            <AnimatedRoutes />
          </Layout>
        </BrowserRouter>
        {/* </BackendStatusProvider> */}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
