import FormInput from "../components/formelements/FormInput";
import FormButton from "../components/formelements/FormButton";
import Logo from "../components/logo";

/**
 * Login Component
 * Renders a sign-in page with email and password inputs
 * Features a split layout with credentials form on the left and decorative image on the right
 */
function Reset() {
  return (
    <>
      {/* Main container with split layout */}
      <div className="overflow-x-hidden relative font-poppins py-[8px] px-[8px] flex h-screen w-screen justify-between">
        {/* Logo/Brand name in top-left corner */}
        <Logo />

        {/* Credentials section - Left side of the split layout */}
        <div className="credentials justify-center mx-auto items-center my-auto px-4 lg:px-[128px] w-full md:w-1/2">
          <h1 className="font-bold text-[32px] mb-4">Reset Your Password</h1>

          {/* Password input field */}
          <div>
            <FormInput
              label="New Password"
              type="password"
              placeholder="•••••••••"
              icon="/assets/icons/lock-line-1.png"
              secondIcon= "/assets/icons/eye-line.png"
            />
          </div>

          {/* Password input field */}
          <div>
            <FormInput
              label="Confirm New Password"
              type="password"
              placeholder="•••••••••"
              icon="/assets/icons/lock-line-1.png"
              secondIcon= "/assets/icons/eye-line.png"
            />
          </div>


          <FormButton className="btn-primary" label="RESET PASSWORD" />

        </div>

        {/* Decorative image section - Right side of the split layout */}
        <div className="hidden lg:flex  pt-18 image h-full px-20 rounded-2xl flex-col justify-around w-1/2 bg-brand-primary">
          <div className="justify-space-around flex flex-col items-center">
            <div className="flex justify-space-between max-w-50 relative">
              <img
                src="/assets/icons/freepik--speech-bubble--inject-6.png"
                alt="Chat Illustration"
                className="w-13 h-max absolute right-54 top-[-60px] "
              />
              <img
                src="/assets/icons/Frame 1261157598.png"
                alt="Chat Illustration"
                className="w-fit"
              />
            </div>
          </div>

          <div className="top-0 left-0 max-w-130">
            <h1 className="font-bold  text-white text-center text-[32px] mb-1">
              Chat with our AI buddy
            </h1>
            <p className="text-white text-center">
              Lorem ipsum dolor sit amet consectetur ipsum dolor sit amet
              consectetur adipisicing elit. Esse, illo?
            </p>
          </div>
          <div className=" flex gap-1 justify-center items-center">
            <div className="w-[12px] h-[12px] rounded-full bg-white/50"></div>
            <div className="w-[31px] h-[12px] rounded-full bg-white"></div>
            <div className="w-[12px] h-[12px] rounded-full bg-white/50"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Reset;
