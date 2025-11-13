import FormInput from "@/components/ui/Form/FormInput";
import Checkbox from "@/components/ui/Form/FormCheckbox";
import FormButton from "@/components/ui/Form/FormButton";

function Login() {
  return (
    <>
          <h1 className="font-bold text-[32px] mb-4">Sign In</h1>

          {/* Email input field */}
          <div>
            <FormInput
              label="Email Address"
              type="email"
              placeholder="example@gmail.com"
              icon="/assets/icons/mail-line-1.png"
            />
          </div>

          {/* Password input field */}
          <div>
            <FormInput
              label="Password"
              type="password"
              placeholder="•••••••••"
              icon="/assets/icons/lock-line-1.png"
              secondIcon= "/assets/icons/eye-line.png"
            />
          </div>

          <div className="flex sz-8  justify-between">
            <div className="gap-1 flex items-center">
              <Checkbox className="checkbox" />
              <p>Remember Me</p>
            </div>
            <a
              href=""
              className="text-brand-primary hover:underline checked:bg-blue-700 accent-brand-primary"
            >
              Forgot Password
            </a>
          </div>
          <FormButton className="btn-primary" label="SIGN IN" />
          <p className=" sz-7 text-center mt-5 text-neutral-n5">
            or sign in with
          </p>
          <div className="flex gap-2 items-stretch">
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
            iconAlt="Google Icon"
          />
            <FormButton
            className="btn-outline"
            label=""
            icon="/assets/icons/facebook-color.png"
            iconAlt="Google Icon"
          />
          </div>
    </>
  );
}

export default Login;
