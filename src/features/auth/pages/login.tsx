import type { ChangeEvent, FormEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import FormInput from "@/components/ui/Form/FormInput";
import Checkbox from "@/components/ui/Form/FormCheckbox";
import FormButton from "@/components/ui/Form/FormButton";
import { setAuthToken, clearAuthToken, setStoredUser } from "@/lib/api/axios";
import { login } from "@/lib/api/endpoints";

type LoginProps = {
  onForgotPassword?: () => void;
};

type LoginForm = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const INITIAL_FORM: LoginForm = {
  email: "",
  password: "",
  rememberMe: false,
};

function Login({ onForgotPassword }: LoginProps) {
  const [formValues, setFormValues] = useState<LoginForm>(INITIAL_FORM);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSubmitDisabled = useMemo(() => {
    return !formValues.email.trim() || !formValues.password || isSubmitting;
  }, [formValues, isSubmitting]);

  const handleInputChange = useCallback(
    (field: keyof LoginForm) => (event: ChangeEvent<HTMLInputElement>) => {
      const value = field === "rememberMe" ? event.target.checked : event.target.value;
      setFormValues((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ type: null, message: "" });

    if (isSubmitDisabled) {
      setStatus({
        type: "error",
        message: "Please enter your email and password.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        email: formValues.email.trim(),
        password: formValues.password,
      };

      const response = await login(payload);
      
      // Extract token and user from response structure
      const token = response?.token;
      const userData = response?.user;
      
      // Validate that we received both token and user data
      if (!token) {
        throw new Error("Authentication failed: No token received from server.");
      }
      
      if (!userData) {
        throw new Error("Authentication failed: No user data received from server.");
      }
      
      // Store authentication data
      setAuthToken(token, formValues.rememberMe);
      setStoredUser(userData, formValues.rememberMe);

      setStatus({
        type: "success",
        message: "Welcome back!",
      });
      setFormValues((prev) => ({ ...INITIAL_FORM, rememberMe: prev.rememberMe }));
      
      // Only navigate after successful authentication
      window.location.href = "/";
    } catch (error: any) {
      // Clear any partial auth data on error
      clearAuthToken();
      
      const rawMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "";

      const lower = String(rawMessage).toLowerCase();
      if (
        lower.includes("password") &&
        (lower.includes("uppercase") || lower.includes("number") || lower.includes("special"))
      ) {
        setStatus({ type: "error", message: "Incorrect email or password" });
        return;
      }

      const apiMessage =
        rawMessage ||
        "Unable to sign in right now. Please check your credentials.";
      setStatus({ type: "error", message: apiMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="font-bold text-[32px] mb-4">Sign In</h1>

      <FormInput
        label="Email Address"
        type="email"
        placeholder="example@gmail.com"
        icon="/assets/icons/mail-line-1.png"
        value={formValues.email}
        onChange={handleInputChange("email")}
        required
      />

      <FormInput
        label="Password"
        type={showPassword ? "text" : "password"}
        placeholder="•••••••••"
        icon="/assets/icons/lock-line-1.png"
        secondIcon={
          showPassword ? "/assets/icons/eye-off-line.png" : "/assets/icons/eye-line.png"
        }
        secondIconAlt={showPassword ? "Hide password" : "Show password"}
        onSecondIconClick={() => setShowPassword((prev) => !prev)}
        value={formValues.password}
        onChange={handleInputChange("password")}
        required
      />

      <div className="flex sz-8 justify-between">
        <label className="gap-1 flex items-center">
          <Checkbox
            className="checkbox"
            checked={formValues.rememberMe}
            onChange={handleInputChange("rememberMe")}
          />
          <span>Remember Me</span>
        </label>
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-brand-primary hover:underline"
        >
          Forgot Password
        </button>
      </div>

      {status.message && (
        <p
          className={`mt-4 text-sm ${
            status.type === "error" ? "text-ui-negative" : "text-ui-success"
          }`}
        >
          {status.message}
        </p>
      )}

      <FormButton
        className={`btn-primary ${isSubmitting ? "opacity-60" : ""}`}
        label={isSubmitting ? "Signing In..." : "SIGN IN"}
        type="submit"
        disabled={isSubmitDisabled}
      />

      <p className="sz-7 text-center mt-5 text-neutral-n5">or sign in with</p>
      <div className="flex gap-2 items-stretch">
        <FormButton
          className="btn-outline"
          label=""
          icon="/assets/icons/google.png"
          iconAlt="Google Icon"
          type="button"
        />
        <FormButton
          className="btn-outline"
          label=""
          icon="/assets/icons/twitter.png"
          iconAlt="Twitter Icon"
          type="button"
        />
        <FormButton
          className="btn-outline"
          label=""
          icon="/assets/icons/facebook-color.png"
          iconAlt="Facebook Icon"
          type="button"
        />
      </div>
    </form>
  );
}

export default Login;
