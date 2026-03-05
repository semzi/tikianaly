import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "@/components/ui/Form/FormInput";
import FormButton from "@/components/ui/Form/FormButton";
import Logo from "@/components/common/Logo";
import { clearResetToken, getResetToken } from "@/lib/api/axios";
import { forgotPasswordResetPassword } from "@/lib/api/endpoints";

/**
 * Login Component
 * Renders a sign-in page with email and password inputs
 * Features a split layout with credentials form on the left and decorative image on the right
 */
function Reset() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>(
    { type: null, message: "" }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const isSubmitDisabled = useMemo(() => {
    return !password || isSubmitting;
  }, [isSubmitting, password]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });

    const resetToken = getResetToken();
    if (!resetToken) {
      setStatus({ type: "error", message: "Reset session expired. Please request OTP again." });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        newPassword: password,
        confirmPassword: password,
      };

      await forgotPasswordResetPassword(payload, resetToken);
      clearResetToken();

      setStatus({ type: "success", message: "Password reset successful. Please sign in." });
      navigate("/login");
    } catch (error: any) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Unable to reset password right now.";
      setStatus({ type: "error", message: apiMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Main container with split layout */}
      <div className="overflow-x-hidden relative font-poppins py-[8px] px-[8px] flex h-screen w-screen justify-between">
        {/* Logo/Brand name in top-left corner */}
        <Logo />

        {/* Credentials section - Left side of the split layout */}
        <div className="credentials justify-center mx-auto items-center my-auto px-4 lg:px-[128px] w-full md:w-1/2">
          <form onSubmit={handleSubmit}>
            <h1 className="font-bold text-[32px] mb-4">Reset Your Password</h1>

            <div>
              <FormInput
                label="New Password"
                type={showPassword ? "text" : "password"}
                placeholder="•••••••••"
                icon="/assets/icons/lock-line-1.png"
                secondIcon={
                  showPassword
                    ? "/assets/icons/eye-off-line.png"
                    : "/assets/icons/eye-line.png"
                }
                secondIconAlt={showPassword ? "Hide password" : "Show password"}
                onSecondIconClick={() => setShowPassword((prev) => !prev)}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
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
              className={`btn-primary mt-6 ${isSubmitting ? "opacity-60" : ""}`}
              label={isSubmitting ? "RESETTING..." : "RESET PASSWORD"}
              disabled={isSubmitDisabled}
              type="submit"
            />
          </form>
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
