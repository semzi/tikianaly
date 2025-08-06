import FormInput from "../components/formelements/FormInput";
import Checkbox from "../components/formelements/FormCheckbox";
import FormButton from "../components/formelements/FormButton";
import Logo from "../components/logo";

/**
 * Signup Component
 * Renders a sign-up page with email and password inputs.
 * Features a split layout: credentials form on the left, fixed decorative image/info on the right.
 */
function Signup() {
  return (
    <>
      {/* Main container with split layout */}
      <div className="overflow-x-hidden relative font-poppins  py-2 px-2 flex h-screen w-screen">
        {/* Logo/Brand name in top-left corner */}
        <Logo />

        {/* Credentials section - Left side of the split layout */}
        <div className="credentials pt-25 justify-center mx-auto items-center my-auto mb-5 px-4 lg:px-[128px] w-full md:w-1/2 lg:mr-[50vw]">
          <h1 className="font-bold text-[32px] mb-4">Create Account</h1>

          {/* Password input fields */}
          <FormInput
            label="Full Name"
            type="text"
            placeholder="John Doe"
            icon="/assets/icons/user.png"
          />
          <p className=" mb-2">Phone Number</p>
          <div
            className={`flex items-center gap-3 h-[44px] sm:h-[50px] md:h-[56px] 
        w-full max-w-full sm:max-w-md md:max-w-lg 
        border border-snow-200 px-3 sm:px-4 mb-4 rounded-[8px]`}
          >
            <div className="p-1 sz-7">
              <p>+234</p>
            </div>
            <div className="py-3 w-[2px] bg-gray-200"></div>
            <input
              type="tel"
              placeholder="Enter your phone number"
              className={`w-full text-[13px] sm:text-[14px] md:text-[15px] outline-none border-none`}
            />
          </div>
          {/* Email input field */}
          <FormInput
            label="Email Address"
            type="email"
            placeholder="example@gmail.com"
            icon="/assets/icons/mail-line-1.png"
          />
          <FormInput
            label="Password"
            type="password"
            placeholder="•••••••••"
            icon="/assets/icons/lock-line-1.png"
            secondIcon="/assets/icons/eye-line.png"
          />
          {/* // VAlidate Password field */}
          <div>
            <div className="flex gap-2 mb-3 items-stretch">
              <div className="bg-ui-negative w-full rounded-2xl  h-[12px]"></div>
              <div className="bg-ui-pending rounded-2xl w-full h-[12px]"></div>
              <div className="bg-ui-success rounded-2xl w-full h-[12px]"></div>
            </div>
            <div className="flex mt-2 gap-2 items-center">
              <div className="bg-ui-success w-[12px] rounded h-[12px]"></div>
              <p className="sz-7 text-neutral-n5">
              Minimum criteria of x met
              </p>
            </div>
            <div className="flex mt-2 gap-2 items-center">
              <div className="bg-ui-success w-[12px] rounded h-[12px]"></div>
              <p className="sz-7 text-neutral-n5">
              Next criteria met
              </p>
            </div>
            <div className="flex mt-2 gap-2 items-center">
              <div className="bg-ui-negative w-[12px] rounded h-[12px]"></div>
              <p className="sz-7 text-neutral-n5">
              Criteria not met
              </p>
            </div>
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex sz-8  justify-between w-full mt-4 mb-4">
            <div className="gap-1 flex items-center">
              <Checkbox className="checkbox" />
              <p>
                I agree to the{" "}
                <a href="#" className="text-brand-primary hover:underline">
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-brand-primary hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>

          {/* Sign Up button */}
          <FormButton className="btn-primary" label="SIGN UP" />

          {/* Alternative sign-up options */}
          <p className="sz-7 text-center mt-5 text-neutral-n5">
            or sign up with
          </p>
          <div className="flex gap-2 items-stretch mt-2">
            <FormButton
              className="btn-outline"
              label=""
              icon="/assets/icons/google.png"
              iconAlt="Google Icon"
            />
            <FormButton
              className="btn-outline"
              label=""
              icon="/assets/icons/twitter.png"
              iconAlt="Twitter Icon"
            />
            <FormButton
              className="btn-outline"
              label=""
              icon="/assets/icons/facebook-color.png"
              iconAlt="Facebook Icon"
            />
          </div>

          {/* Sign in link */}
          <p className="flex sz-7 text-center justify-center mt-8">
            Already have an account?
            <a href="#" className="ml-1 underline text-brand-primary">
              Sign In
            </a>
          </p>
        </div>

        {/* Decorative image section - Right side, fixed and always visible */}
        <div className="hidden lg:flex fixed top-2 right-2 h-[calc(100vh-1rem)] px-20 rounded-2xl flex-col justify-around w-1/2 bg-brand-primary z-10">
          <div className="flex flex-col items-center">
            {/* Decorative chat illustrations */}
            <div className="flex justify-between max-w-50 relative">
              <img
                src="/assets/icons/freepik--speech-bubble--inject-6.png"
                alt="Chat Illustration"
                className="w-13 h-max absolute right-54 top-[-60px]"
              />
              <img
                src="/assets/icons/Frame 1261157598.png"
                alt="Chat Illustration"
                className="w-fit"
              />
            </div>
          </div>

          {/* Info text */}
          <div className="top-0 left-0 max-w-130">
            <h1 className="font-bold text-white text-center text-[32px] mb-1">
              Chat with our AI buddy
            </h1>
            <p className="text-white text-center">
              Lorem ipsum dolor sit amet consectetur ipsum dolor sit amet
              consectetur adipisicing elit. Esse, illo?
            </p>
          </div>

          {/* Carousel dots/indicators */}
          <div className="flex gap-1 justify-center items-center">
            <div className="w-[12px] h-[12px] rounded-full bg-white/50"></div>
            <div className="w-[31px] h-[12px] rounded-full bg-white"></div>
            <div className="w-[12px] h-[12px] rounded-full bg-white/50"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
