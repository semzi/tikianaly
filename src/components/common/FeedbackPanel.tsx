import { useState, type FormEvent } from "react";
import {
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

type FeedbackPanelValues = {
  name: string;
  email: string;
  message: string;
};

type FeedbackPanelProps = {
  className?: string;
  onSubmit?: (values: FeedbackPanelValues) => void | Promise<void>;
};

export default function FeedbackPanel({ className, onSubmit }: FeedbackPanelProps) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = { name, email, message };
    if (onSubmit) await onSubmit(values);
  };

  return (
    <div className={className ?? ""}>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center flex-shrink-0">
          <ChatBubbleLeftRightIcon className="w-5 h-5 text-brand-primary" />
        </div>
        <div className="min-w-0">
          <p className="font-[500] sz-4 theme-text">Have any complaint or suggestion?</p>
          <p className="text-xs text-neutral-n5 dark:text-snow-200">
            Kindly reach out to us using the form below.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-neutral-n5 dark:text-snow-200">Name (optional)</span>
          <div className="flex items-center gap-2 bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded-lg px-3 py-2">
            <UserIcon className="w-4 h-4 text-neutral-n5 dark:text-snow-200" />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-transparent outline-none text-sm theme-text placeholder:text-neutral-n5/70 dark:placeholder:text-snow-200/50"
            />
          </div>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-neutral-n5 dark:text-snow-200">Email</span>
          <div className="flex items-center gap-2 bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded-lg px-3 py-2">
            <EnvelopeIcon className="w-4 h-4 text-neutral-n5 dark:text-snow-200" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              type="email"
              required
              className="w-full bg-transparent outline-none text-sm theme-text placeholder:text-neutral-n5/70 dark:placeholder:text-snow-200/50"
            />
          </div>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-neutral-n5 dark:text-snow-200">Message</span>
          <div className="flex items-start gap-2 bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded-lg px-3 py-2">
            <PencilSquareIcon className="w-4 h-4 text-neutral-n5 dark:text-snow-200 mt-0.5" />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              required
              rows={4}
              className="w-full bg-transparent outline-none text-sm theme-text placeholder:text-neutral-n5/70 dark:placeholder:text-snow-200/50 resize-none"
            />
          </div>
        </label>

        <button
          type="submit"
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-brand-primary text-white text-sm font-medium px-4 py-2.5 hover:opacity-95 transition-opacity"
        >
          <PaperAirplaneIcon className="w-4 h-4" />
          Send
        </button>
      </form>
    </div>
  );
}
