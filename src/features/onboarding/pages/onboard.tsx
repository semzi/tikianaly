import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "@/features/auth/pages/login";
import Signup from "@/features/auth/pages/signup";
import { navigate } from "@/lib/router/navigate";
import { ArrowLeftIcon } from "lucide-react";

/**
 * Auth Component
 * Renders a sign-in or sign-up page with email and password inputs
 * Features a split layout with credentials form on the left and sliding onboarding images on the right
 */
function Onboard() {
  const location = useLocation();
  const isSignup = location.pathname === "/signup";
  
  const [currentSlide, setCurrentSlide] = useState(0);
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
          {isSignup ? <Signup /> : <Login />}
          <p className="flex sz-7 text-center justify-center mt-8">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <Link to="/login" className=" ml-1 underline text-brand-primary" >
                  Sign In
                </Link>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <Link to="/signup" className=" ml-1 underline text-brand-primary" >
                  Sign Up
                </Link>
              </>
            )}
          </p>
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
