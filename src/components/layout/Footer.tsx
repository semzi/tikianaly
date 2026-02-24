// import  footerLinks  from '/data/footerLink'
import { useEffect, useState, type FormEvent, type MouseEvent } from "react";
import { EnvelopeIcon, PencilSquareIcon, UserIcon } from "@heroicons/react/24/outline";
import apiClient from "../../lib/api/axios";
import { useToast } from "../../context/ToastContext";
const footerLinks = [
  { label: "Community", href: "https://tikianaly.com" },
  { label: "Blog", href: "https://blog.tikianaly.com" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Contact", href: "mailto:info@tikianaly.com" },
];

export const FooterComp = () => {
  const [showMobileAppPopup, setShowMobileAppPopup] = useState(false);
  const toast = useToast();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const handleFeedbackSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (isSubmittingFeedback) return;

    try {
      setIsSubmittingFeedback(true);
      await apiClient.post("/api/v1/feedback", {
        fullName,
        email,
        message,
      });

      toast.show({
        variant: "success",
        message: "Feedback submitted successfully.",
      });
      setFullName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      toast.show({
        variant: "error",
        message: "Failed to submit feedback. Please try again.",
      });
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  useEffect(() => {
    if (!showMobileAppPopup) return;

    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") setShowMobileAppPopup(false);
    };

    window.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [showMobileAppPopup]);

  const openMobileAppPopup = (ev: MouseEvent) => {
    ev.preventDefault();
    setShowMobileAppPopup(true);
  };

  return (
    <>
      <div className="m-page-padding-x bg-[#D9EBFF] text-[#0F172A]">
        <div className="mx-auto max-w-[1200px] py-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-[520px]">
              <h3 className="text-2xl md:text-3xl font-semibold">
                Got feedback, suggestions,
                <br />
                or concerns?
              </h3>
              <p className="mt-3 text-sm md:text-base text-slate-700">
                We're always looking for ways to improve, and your input plays a big role in that.
                If you have a suggestion, improvement idea, or feedback you'd like to share, we'd love to hear it.
              </p>
            </div>

            <form className="w-full md:max-w-[560px]" onSubmit={handleFeedbackSubmit}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">Full Name</label>
                  <div className="flex items-center gap-2 h-10 rounded bg-white px-3 text-sm text-slate-900 outline-none ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-brand-secondary">
                    <UserIcon className="w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">Email Address</label>
                  <div className="flex items-center gap-2 h-10 rounded bg-white px-3 text-sm text-slate-900 outline-none ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-brand-secondary">
                    <EnvelopeIcon className="w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      placeholder="example@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">Your Message</label>
                <div className="flex items-start gap-2 rounded bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-brand-secondary">
                  <PencilSquareIcon className="w-4 h-4 text-slate-500 mt-0.5" />
                  <textarea
                    rows={4}
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="min-h-[110px] w-full resize-none bg-transparent outline-none"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmittingFeedback}
                  className="h-10 rounded bg-brand-secondary px-5 text-sm font-semibold text-white hover:opacity-95"
                >
                  {isSubmittingFeedback ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="m-page-padding-x py-15 bg-brand-primary  text-white">
        <div className="flex-col gap-y-15 lg:flex-row flex justify-between ">
          <div
            className="flex flex-col gap-7
         max-w-150"
          >
            <a href="/">
              <img
                src="\logos\whitelogo.png"
                className="w-60"
                alt="TikiAnaly Logo"
              />
            </a>
            <p>
              Sports Space Made for Everyone.
            </p>
            <div className="flex flex-wrap gap-4">
            {/* X (Twitter) */}
            <a
              href="https://x.com/TikiAnaly"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              title="X (Twitter)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                fill="currentColor"
                className="h-7 w-7"
                width="100"
                height="100"
                viewBox="0 0 50 50"
              >
                <path d="M 6.9199219 6 L 21.136719 26.726562 L 6.2285156 44 L 9.40625 44 L 22.544922 28.777344 L 32.986328 44 L 43 44 L 28.123047 22.3125 L 42.203125 6 L 39.027344 6 L 26.716797 20.261719 L 16.933594 6 L 6.9199219 6 z"></path>
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com/tikianaly"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              title="Facebook"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                fill="currentColor"
                className="h-7 w-7"
                width="100"
                height="100"
                viewBox="0 0 50 50"
              >
                <path d="M25,2C12.318,2,2,12.317,2,25s10.318,23,23,23c12.683,0,23-10.317,23-23S37.683,2,25,2z M32,16h-3.29 C26.772,16,26,16.455,26,17.806V21h6l-1,5h-5v13h-6V26h-3v-5h3v-2.774C20,14.001,21.686,11,26.581,11C29.203,11,32,12,32,12V16z"></path>
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/tikianalyapp"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              title="Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                fill="currentColor"
                className="h-7 w-7"
                width="100"
                height="100"
                viewBox="0 0 50 50"
              >
                <path d="M 16 3 C 8.83 3 3 8.83 3 16 L 3 34 C 3 41.17 8.83 47 16 47 L 34 47 C 41.17 47 47 41.17 47 34 L 47 16 C 47 8.83 41.17 3 34 3 L 16 3 z M 37 11 C 38.1 11 39 11.9 39 13 C 39 14.1 38.1 15 37 15 C 35.9 15 35 14.1 35 13 C 35 11.9 35.9 11 37 11 z M 25 14 C 31.07 14 36 18.93 36 25 C 36 31.07 31.07 36 25 36 C 18.93 36 14 31.07 14 25 C 14 18.93 18.93 14 25 14 z M 25 16 C 20.04 16 16 20.04 16 25 C 16 29.96 20.04 34 25 34 C 29.96 34 34 29.96 34 25 C 34 20.04 29.96 16 25 16 z"></path>
              </svg>
            </a>

            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@tikianaly"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              title="TikTok"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                fill="currentColor"
                className="h-7 w-7"
                width="100"
                height="100"
                viewBox="0 0 50 50"
              >
                <path d="M41,4H9C6.243,4,4,6.243,4,9v32c0,2.757,2.243,5,5,5h32c2.757,0,5-2.243,5-5V9C46,6.243,43.757,4,41,4z M37.006,22.323 c-0.227,0.021-0.457,0.035-0.69,0.035c-2.623,0-4.928-1.349-6.269-3.388c0,5.349,0,11.435,0,11.537c0,4.709-3.818,8.527-8.527,8.527 s-8.527-3.818-8.527-8.527s3.818-8.527,8.527-8.527c0.178,0,0.352,0.016,0.527,0.027v4.202c-0.175-0.021-0.347-0.053-0.527-0.053 c-2.404,0-4.352,1.948-4.352,4.352s1.948,4.352,4.352,4.352s4.527-1.894,4.527-4.298c0-0.095,0.042-19.594,0.042-19.594h4.016 c0.378,3.591,3.277,6.425,6.901,6.685V22.323z"></path>
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://www.youtube.com/@TikiAnaly"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              title="YouTube"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                fill="currentColor"
                className="h-7 w-7"
                width="100"
                height="100"
                viewBox="0 0 50 50"
              >
                <path d="M 44.898438 14.5 C 44.5 12.300781 42.601563 10.699219 40.398438 10.199219 C 37.101563 9.5 31 9 24.398438 9 C 17.800781 9 11.601563 9.5 8.300781 10.199219 C 6.101563 10.699219 4.199219 12.199219 3.800781 14.5 C 3.398438 17 3 20.5 3 25 C 3 29.5 3.398438 33 3.898438 35.5 C 4.300781 37.699219 6.199219 39.300781 8.398438 39.800781 C 11.898438 40.5 17.898438 41 24.5 41 C 31.101563 41 37.101563 40.5 40.601563 39.800781 C 42.800781 39.300781 44.699219 37.800781 45.101563 35.5 C 45.5 33 46 29.398438 46.101563 25 C 45.898438 20.5 45.398438 17 44.898438 14.5 Z M 19 32 L 19 18 L 31.199219 25 Z"></path>
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/company/tikianaly"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              title="LinkedIn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                fill="currentColor"
                className="h-7 w-7"
                width="100"
                height="100"
                viewBox="0 0 50 50"
              >
                <path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z"></path>
              </svg>
            </a>

            {/* Medium */}
            <a
              href="https://medium.com/@tikianaly"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              title="Medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                fill="currentColor"
                className="h-7 w-7"
                width="100"
                height="100"
                viewBox="0 0 50 50"
              >
                <path d="M45,4H5C4.448,4,4,4.448,4,5v40c0,0.552,0.448,1,1,1h40c0.552,0,1-0.448,1-1V5C46,4.448,45.552,4,45,4z M40,13.5 l-1.821,1.739C38.044,15.366,38,15.522,38,15.68v16.64c0,0.158,0.044,0.314,0.179,0.441L40,34.5V35H28v-0.5l2.821-2.739 C30.956,31.634,31,31.478,31,31.32V17.21L22.846,35h-0.966l-9.707-17.79v11.926c0,0.3,0.071,0.582,0.308,0.768L15,34.5V35H7v-0.5 l2.519-4.596c0.237-0.186,0.308-0.468,0.308-0.768V14.705c0-0.241-0.068-0.46-0.272-0.608L7,11.5V11h7.931l6.613,14.517L27.208,11 H35v0.5H40z"></path>
              </svg>
            </a>

            {/* Threads */}
            <a
              href="https://www.threads.com/@tikianalyapp"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              title="Threads"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                fill="currentColor"
                className="h-7 w-7"
                width="100"
                height="100"
                viewBox="0 0 50 50"
              >
                <path d="M 39 4 L 11 4 C 7.134 4 4 7.134 4 11 L 4 39 C 4 42.866 7.134 46 11 46 L 39 46 C 42.866 46 46 42.866 46 39 L 46 11 C 46 7.134 42.866 4 39 4 z M 25 11 C 27.757 11 30.202 11.784 32.027 13.164 C 33.499 14.29 34.604 15.84 35.164 17.695 L 31.777 18.695 C 31.442 17.585 30.812 16.688 29.973 16.031 C 28.832 15.149 27.204 14.75 25 14.75 C 21.651 14.75 19.097 16.407 17.82 18.836 C 17.08 20.213 16.75 21.849 16.75 23.5 C 16.75 25.151 17.08 26.787 17.82 28.164 C 19.097 30.593 21.651 32.25 25 32.25 C 27.019 32.25 28.568 31.787 29.668 31.039 C 30.161 30.701 30.587 30.294 30.938 29.828 C 29.733 29.545 28.663 29.078 27.813 28.422 C 26.608 27.514 25.916 26.298 25.916 24.875 C 25.916 22.893 27.085 21.353 28.727 20.609 C 29.694 20.171 30.762 20.043 31.707 20.164 C 32.641 20.284 33.52 20.656 34.148 21.383 C 35.006 22.378 35.25 23.678 35.25 24.875 L 35.25 27 C 35.25 27.965 35.285 28.867 35.609 29.609 C 35.771 30.004 36.018 30.346 36.379 30.594 C 36.74 30.841 37.229 31 37.875 31 C 38.476 31 38.935 30.828 39.277 30.598 C 39.619 30.368 39.883 30.054 40.082 29.688 C 40.481 28.954 40.6 27.999 40.641 27.039 C 40.642 27.007 40.641 26.976 40.641 26.945 C 40.641 26.934 40.643 26.923 40.643 26.912 C 40.648 26.769 40.652 26.629 40.652 26.5 C 40.652 21.892 39.127 18.517 36.613 16.32 C 34.099 14.122 30.611 13 26.5 13 C 22.389 13 18.901 14.122 16.387 16.32 C 13.873 18.517 12.348 21.892 12.348 26.5 C 12.348 31.108 13.873 34.483 16.387 36.68 C 18.901 38.878 22.389 40 26.5 40 C 29.433 40 32.02 39.391 34.148 38.133 C 35.214 37.502 36.135 36.705 36.875 35.734 L 39.77 37.734 C 38.807 39.045 37.606 40.122 36.227 40.969 C 33.605 42.575 30.402 43.25 26.5 43.25 C 21.611 43.25 17.224 41.847 14.113 39.07 C 11.002 36.293 9.098 32.142 9.098 26.5 C 9.098 20.858 11.002 16.707 14.113 13.93 C 17.224 11.153 21.611 9.75 26.5 9.75 L 25 11 z M 31.25 24.875 C 31.25 24.589 31.204 24.314 31.055 24.117 C 30.906 23.92 30.692 23.841 30.395 23.785 C 30.098 23.729 29.679 23.704 29.211 23.891 C 28.915 24.007 28.666 24.232 28.666 24.875 C 28.666 25.452 28.892 25.736 29.438 26.141 C 29.983 26.545 30.947 26.918 32.5 27.125 L 32.5 24.875 C 32.5 24.875 31.25 24.875 31.25 24.875 z"></path>
              </svg>
            </a>

            {/* Pinterest */}
            <a
              href="https://www.pinterest.com/tikianaly"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              title="Pinterest"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                fill="currentColor"
                className="h-7 w-7"
                width="100"
                height="100"
                viewBox="0 0 50 50"
              >
                <path d="M25,2C12.3178711,2,2,12.3178711,2,25c0,9.8841553,6.2675781,18.3302612,15.036377,21.5769653 c-0.2525635-2.0503845-0.2129517-5.5650024,0.4088135-7.8393555c0.6437988-2.3533936,4.2095337-17.8103027,4.2095337-17.8103027 s-1.0786133-2.1487427-1.0786133-5.3232422c0-4.9884033,2.8923340-8.7110596,6.4956055-8.7110596 c3.0605469,0,4.5393677,2.2992554,4.5393677,5.0549927c0,3.0783081-1.9588623,7.6865234-2.9676514,11.9555054 c-0.8441162,3.5667114,1.7869263,6.4768066,5.2975464,6.4768066c6.3577881,0,10.6166992-8.1451416,10.6166992-17.7487183 c0-7.3151245-4.9383545-12.7836914-13.8919678-12.7836914c-10.0980835,0-16.4510498,7.5463867-16.4510498,16.0112305 c0,2.9094238,0.8581543,4.9533691,2.1970215,6.5605469c0.6125488,0.71521,0.6988525,1.0045166,0.4769897,1.8288574 c-0.1644897,0.6007080-0.5319214,2.1030884-0.6881104,2.687561c-0.2246704,0.8448486-0.9208984,1.1469727-1.6929932,0.8360596 c-4.7378540-1.9361572-6.9406738-7.1123047-6.9406738-12.9353027c0-9.6140137,8.1026611-21.1176758,24.1401367-21.1176758 c12.7951660,0,21.2251587,9.2173462,21.2251587,19.0802002c0,13.0440674-7.2673950,22.8338623-17.9663086,22.8338623 c-3.5788574,0-6.9519043-1.9385986-8.1050415-4.1469727c0,0-1.9449463,7.7195435-2.3441162,9.2telegraphic486 c-0.7004395,2.6507568-2.0679932,5.3165894-3.3419189,7.3582764C19.3026733,47.5954590,22.0546265,48,25,48 c12.6821289,0,23-10.3178711,23-23C48,12.3178711,37.6821289,2,25,2z"></path>
              </svg>
            </a>
          </div>
            <div className="flex gap-3">
              <a
                href=""
                onClick={openMobileAppPopup}
              >
                <img
                  src="\assets\icons\play_store.png"
                  className="h-10"
                  alt="Google Play Store"
                />
              </a>
              <a
                href=""
                onClick={openMobileAppPopup}
              >
                <img
                  src="\assets\icons\apple_store.png"
                  className="h-10"
                  alt="Apple App Store"
                />
              </a>
            </div>
          </div>
          <div className="links sz-4">
            <div className="grid grid-cols-2 gap-x-30 sm:grid-cols-2 gap-4">
              {footerLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="hover:text-brand-secondary text-sm"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <p className="text-center mb-8 mt-18">
          Copyright ©2026 Tikianaly / All rights reserved
        </p>
        <p className="text-center text-xs text-white/70 -mt-6 mb-2">
          API provided by GoalServe
        </p>
      </div>

      {showMobileAppPopup && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowMobileAppPopup(false)}
            aria-label="Close"
          />
          <div className="relative w-full max-w-md rounded-xl bg-white p-6 text-slate-900 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold">Mobile app coming soon</p>
                <p className="mt-1 text-sm text-slate-600">
                  For now we stick with the Web version.
                </p>
              </div>
              <button
                type="button"
                className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                onClick={() => setShowMobileAppPopup(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                className="rounded-lg bg-brand-secondary px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                onClick={() => setShowMobileAppPopup(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default FooterComp;