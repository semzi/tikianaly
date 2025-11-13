import FormInput from "@/components/ui/Form/FormInput";
import Checkbox from "@/components/ui/Form/FormCheckbox";
import FormButton from "@/components/ui/Form/FormButton";

function Signup() {
  return (
    <>
      <h1 className="font-bold text-[32px] mb-4">Create Account</h1>

      {/* Full Name input field */}
      <FormInput
        label="Full Name"
        type="text"
        placeholder="John Doe"
        icon="/assets/icons/user.png"
      />

      {/* Phone Number input field */}
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

      {/* Password input field */}
      <FormInput
        label="Password"
        type="password"
        placeholder="•••••••••"
        icon="/assets/icons/lock-line-1.png"
        secondIcon="/assets/icons/eye-line.png"
      />

      {/* Password validation indicator */}
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

      {/* Terms and Conditions checkbox */}
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
    </>
  );
}

export default Signup;
