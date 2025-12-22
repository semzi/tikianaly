import { Button } from "@/components/ui/Button";

export type FeatureComingSoonProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export const FeatureComingSoon = ({
  title = "Feature coming soon",
  description = "This feature is under development and will be available soon.",
  actionLabel,
  onAction,
  className = "",
}: FeatureComingSoonProps) => {
  return (
    <div
      className={`block-style dark:border-[#1F2937] dark:bg-[#161B22] ${className}`}
    >
      <div className="flex flex-col gap-2">
        <p className="font-[600] text-[#23272A] dark:text-snow-200">{title}</p>
        <p className="text-neutral-n4 dark:text-neutral-m6">{description}</p>

        {actionLabel ? (
          <div className="mt-2">
            <Button
              variant="outline"
              label={actionLabel}
              onClick={onAction}
              type="button"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default FeatureComingSoon;
