import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "@/features/auth/pages/login";
import Signup from "@/features/auth/pages/signup";
import { navigate } from "@/lib/router/navigate";
import { ArrowLeftIcon } from "lucide-react";
import { FavouriteSelectionOnboard } from "../components/FavouriteSelectionOnboard";
import popularLeagues from "@/data/favouriteSelect";
import FormInput from "@/components/ui/Form/FormInput";
import FormButton from "@/components/ui/Form/FormButton";
import VerifyOtp from "@/components/auth/VerifyOtp";
import { clearResetToken, setResetToken } from "@/lib/api/axios";
import { forgotPasswordRequestOtp, forgotPasswordVerifyOtp } from "@/lib/api/endpoints";

/**
 * Auth Component
 * Renders a sign-in or sign-up page with email and password inputs
 * Features a split layout with credentials form on the left and sliding onboarding images on the right
 */
function Onboard() {
  const location = useLocation();
  const isSignup = location.pathname === "/signup";
  const isOnboard = location.pathname === "/onboard";
  const [authView, setAuthView] = useState<"login" | "forgot" | "verify">("login");
  const [forgotEmail, setForgotEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpToken, setOtpToken] = useState<string | null>(null);
  const [lastVerifiedOtp, setLastVerifiedOtp] = useState<string>("");
  const [authStatus, setAuthStatus] = useState<{ type: "success" | "error" | null; message: string }>(
    { type: null, message: "" }
  );
  const [authSubmitting, setAuthSubmitting] = useState(false);
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(
    new Set(popularLeagues.filter(item => item.fav).map(item => item.name))
  );
  const onboardingImages = [
    "/onboarding/onboarding1.svg",
    "/onboarding/onboarding2.svg", 
    "/onboarding/onboarding3.svg",
    "/onboarding/onboarding4.svg"
  ];

  const slideContent = [
    {
      title: (
        <>
          Your <span className="text-brand-secondary">AI</span> Sports Companion
        </>
      ),
      description: "Ask questions, get instant answers, and stay ahead in every debate."
    },
    {
      title: (
        <>
           <span className="text-brand-secondary"> Statistics </span> ThatMatter
        </>
      ),
      description: "From player details to team analytics, get the insights fans and analysts trust"
    },
    {
      title: (
        <>
         Real-Time Sports  <span className="text-brand-secondary"> Banter </span>
        </>
      ),
      description: "Join the conversation. Share hot takes, predictions, and celebrate goals together"
    },
    {
      title: (
        <>
          Your <span className="text-brand-secondary">All-in-One</span> Sports Hub
        </>
      ),
      description: "Banter with friends, explore your favorite teams, and never miss a stat."
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % onboardingImages.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [onboardingImages.length]);

  // Loading state for favorites
  useEffect(() => {
    if (isOnboard) {
      const timer = setTimeout(() => setLoading(false), 2);
      return () => clearTimeout(timer);
    }
  }, [isOnboard]);

  const toggleItemSelection = (itemName: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemName)) {
        newSet.delete(itemName);
      } else {
        newSet.add(itemName);
      }
      return newSet;
    });
  };

  const startForgotPassword = () => {
    setAuthStatus({ type: null, message: "" });
    setAuthView("forgot");
  };

  const goBackToLogin = () => {
    setAuthStatus({ type: null, message: "" });
    setAuthSubmitting(false);
    setOtpCode("");
    setOtpToken(null);
    setLastVerifiedOtp("");
    clearResetToken();
    setAuthView("login");
  };

  const submitForgotPassword = async () => {
    const email = forgotEmail.trim();
    if (!email) {
      setAuthStatus({ type: "error", message: "Please enter your email address." });
      return;
    }

    setAuthSubmitting(true);
    setAuthStatus({ type: null, message: "" });
    try {
      const response = await forgotPasswordRequestOtp({ email });
      const nextOtpToken = response?.responseObject?.otpToken;
      if (!nextOtpToken) {
        throw new Error("OTP request failed: no otpToken returned.");
      }

      setOtpToken(nextOtpToken);
      setAuthView("verify");
      setAuthStatus({ type: "success", message: "OTP sent. Please check your email." });
    } catch (error: any) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Unable to request OTP right now.";
      setAuthStatus({ type: "error", message: apiMessage });
    } finally {
      setAuthSubmitting(false);
    }
  };

  const submitVerifyOtp = async (code?: string) => {
    if (authSubmitting) return;

    const email = forgotEmail.trim();
    const otp = (code ?? otpCode).trim();

    if (!email) {
      setAuthStatus({ type: "error", message: "Please enter your email address." });
      setAuthView("forgot");
      return;
    }

    if (otp.length !== 6) {
      setAuthStatus({ type: "error", message: "Please enter the 6-digit OTP." });
      return;
    }

    if (!otpToken) {
      setAuthStatus({ type: "error", message: "OTP session expired. Please request a new code." });
      setAuthView("forgot");
      return;
    }

    if (otp === lastVerifiedOtp) {
      return;
    }

    setAuthSubmitting(true);
    setAuthStatus({ type: null, message: "" });
    try {
      setLastVerifiedOtp(otp);
      const response = await forgotPasswordVerifyOtp({ otp }, otpToken);
      const resetToken = response?.responseObject?.token;
      if (!resetToken) {
        throw new Error("OTP verification failed: no reset token returned.");
      }

      setResetToken(resetToken);
      setAuthStatus({ type: "success", message: "OTP Verified. Please reset your password." });
      navigate("/reset-password");
    } catch (error: any) {
      setLastVerifiedOtp("");
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Unable to verify OTP right now.";
      setAuthStatus({ type: "error", message: apiMessage });
    } finally {
      setAuthSubmitting(false);
    }
  };
  
  return (
    <>
      {/* Main container with split layout */}
      <div className="overflow-hidden relative font-poppins py-[8px] px-[8px] flex h-screen w-screen">
        {/* Logo/Brand name in top-left corner */}
        <Link to="/" className="absolute top-4 left-5 z-10">
          <img
            src="/logos/logocolor.png"
            className="w-20"
            alt="TikiAnaly Logo"
          />
        </Link>
        
        {/* Credentials section - Left side of the split layout */}
       
        <div className={`credentials pt-10 hide-scrollbar justify-center mx-auto items-center my-auto mb-5 px-4 py-10 lg:px-[128px] w-full md:w-1/2 h-full overflow-y-auto`}>
        <button
          type="button"
          className="flex gap-4 items-center cursor-pointer bg-snow-100 rounded-full py-2 px-4 mb-6 h-fit focus:outline-none"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon className="text-black h-5" />
          <p className="text-black hidden md:block">Back</p>
        </button>
          {isOnboard ? (
            <FavouriteSelectionOnboard
              loading={loading}
              items={popularLeagues}
              selectedItems={selectedItems}
              toggleItemSelection={toggleItemSelection}
            />
          ) : isSignup ? (
            <>
              <Signup />
              <p className="flex sz-7 text-center justify-center mt-8">
                Already have an account?{" "}
                <Link to="/login" className=" ml-1 underline text-brand-primary" >
                  Sign In
                </Link>
              </p>
            </>
          ) : (
            <>
              {authView === "login" ? (
                <Login onForgotPassword={startForgotPassword} />
              ) : authView === "forgot" ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitForgotPassword();
                  }}
                >
                  <h1 className="font-bold text-[32px] mb-4">Forgot Password</h1>

                  <FormInput
                    label="Email Address"
                    type="email"
                    placeholder="example@gmail.com"
                    icon="/assets/icons/mail-line-1.png"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />

                  {authStatus.message && (
                    <p
                      className={`mt-4 text-sm ${
                        authStatus.type === "error" ? "text-ui-negative" : "text-ui-success"
                      }`}
                    >
                      {authStatus.message}
                    </p>
                  )}

                  <FormButton
                    className={`btn-primary ${authSubmitting ? "opacity-60" : ""}`}
                    label={authSubmitting ? "SENDING..." : "SEND OTP"}
                    type="submit"
                    disabled={authSubmitting}
                  />

                  <button
                    type="button"
                    onClick={goBackToLogin}
                    className="mt-6 text-brand-primary hover:underline"
                  >
                    Back to Sign In
                  </button>
                </form>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitVerifyOtp();
                  }}
                >
                  <h1 className="font-bold text-[32px] mb-2">Verify OTP</h1>
                  <p className="sz-7 text-neutral-n5 mb-6">
                    Enter the 6-digit code sent to {forgotEmail.trim() || "your email"}.
                  </p>

                  <VerifyOtp
                    length={6}
                    disabled={authSubmitting}
                    onChange={(c) => setOtpCode(c)}
                    onComplete={(c) => setOtpCode(c)}
                  />

                  {authStatus.message && (
                    <p
                      className={`mt-4 text-sm ${
                        authStatus.type === "error" ? "text-ui-negative" : "text-ui-success"
                      }`}
                    >
                      {authStatus.message}
                    </p>
                  )}

                  <FormButton
                    className={`btn-primary mt-6 ${authSubmitting ? "opacity-60" : ""}`}
                    label={authSubmitting ? "VERIFYING..." : "VERIFY"}
                    type="submit"
                    disabled={authSubmitting || otpCode.trim().length !== 6}
                  />

                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={goBackToLogin}
                      className="text-brand-primary hover:underline"
                    >
                      Back to Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthStatus({ type: null, message: "" });
                        submitForgotPassword();
                      }}
                      className="text-brand-primary hover:underline"
                      disabled={authSubmitting}
                    >
                      Resend OTP
                    </button>
                  </div>
                </form>
              )}
              <p className="flex sz-7 text-center justify-center mt-8">
                Don't have an account?{" "}
                <Link to="/signup" className=" ml-1 underline text-brand-primary" >
                  Sign Up
                </Link>
              </p>
            </>
          )}
        </div>

        {/* Onboarding slides section - Right side of the split layout */}
        <div className="hidden lg:flex h-full px-20 pb-10 rounded-2xl flex-col justify-between w-1/2 bg-brand-primary relative overflow-hidden fixed right-0 top-0">
          {/* Fixed slide container at top */}
          <div className="flex-1 flex items-center justify-center pt-20">
            <div className="relative w-full h-full flex items-center justify-center">
              {onboardingImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Onboarding slide ${index + 1}`}
                    className="max-w-full max-h-[80%] object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Fixed content area at bottom */}
          <div className="flex flex-col items-center space-y-6 pb-8">
            {/* Slide content text */}
            <div className="max-w-130 text-center">
              <h1 className="font-bold text-white text-center text-[32px] mb-1 transition-all duration-500">
                {slideContent[currentSlide].title}
              </h1>
              <p className="text-white text-center transition-all duration-500">
                {slideContent[currentSlide].description}
              </p>
            </div>

            {/* Navigation dots */}
            <div className="flex gap-1 justify-center items-center">
              {onboardingImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentSlide
                      ? 'w-[31px] h-[12px] bg-white'
                      : 'w-[12px] h-[12px] bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Onboard;
