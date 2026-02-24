// import  footerLinks  from '/data/footerLink'
import { useState, type FormEvent } from "react";
import { EnvelopeIcon, PencilSquareIcon, UserIcon } from "@heroicons/react/24/outline";
import { useToast } from "../../context/ToastContext";

const footerLinks = [
  { label: "Community", href: "/community" },
  { label: "Blog", href: "https://blog.tikianaly.com" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Contact", href: "mailto:info@tikianaly.com" },
];

export const FooterComp = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const toast = useToast();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) {
      toast.show({ variant: "warning", message: "Please fill in all required fields." });
      return;
    }

    toast.show({ variant: "success", message: "Submitted" });
    setName("");
    setEmail("");
    setMessage("");
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

            <form className="w-full md:max-w-[560px]" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">Full Name</label>
                  <div className="flex items-center gap-2 h-10 rounded bg-white px-3 text-sm text-slate-900 outline-none ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-brand-secondary">
                    <UserIcon className="w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                    className="min-h-[110px] w-full resize-none bg-transparent outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-4 inline-flex items-center justify-center rounded bg-brand-secondary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-95 transition-opacity"
              >
                Submit
              </button>
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
                width={1535}
                height={601}
              />
            </a>
            <p>
              Sports Space Made for Everyone.
            </p>
            <div className="flex gap-7">
              <a
                href="https://www.facebook.com/share/1CU4SPDQon/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="\assets\icons\facebook.png"
                  className="cursor-pointer h-[30px] w-[30px]"
                  alt="Facebook"
                  width={30}
                  height={30}
                />
              </a>
              <a
                href="https://x.com/TikiAnaly"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="\assets\icons\x.png"
                  className="cursor-pointer h-[30px] w-[34px]"
                  alt="X (Twitter)"
                  width={34}
                  height={30}
                />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="\assets\icons\tiktok.png"
                  className="cursor-pointer h-[34px] w-[30px]"
                  alt="TikTok"
                  width={30}
                  height={34}
                />
              </a>
              <a
                href="https://www.instagram.com/tikianaly2025"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="\assets\icons\instagram.png"
                  className="cursor-pointer h-[34px] w-[34px]"
                  alt="Instagram"
                  width={34}
                  height={34}
                />
              </a>
            </div>
            <div className="flex gap-3">
              <a
                href=""
              >
                <img
                  src="\assets\icons\play_store.png"
                  className="h-[65px] w-[196px]"
                  alt="Google Play Store"
                  width={196}
                  height={65}
                />
              </a>
              <a
                href=""
              >
                <img
                  src="\assets\icons\apple_store.png"
                  className="h-[65px] w-[196px]"
                  alt="Apple App Store"
                  width={196}
                  height={65}
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
    </>
  );
};
export default FooterComp;
