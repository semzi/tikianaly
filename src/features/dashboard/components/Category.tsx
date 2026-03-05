import Button from "@/components/ui/Button";
import categories from "@/data/categoryList";
import { useLocation } from "react-router-dom";

type CategoryItem = {
  label: string;
  variant: string;
  href: string;
};

export const Category = () => {
  const location = useLocation();
  
  return (
    <div style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE 10+
        }}>
      <div
        className="flex hide-scrollbar dark:bg-[#0D1117]  w-full gap-2 overflow-x-auto overflow-y-hidden page-padding-x pb-1"
      >
        {categories.map((cat: CategoryItem) => {
          const isDisabled = !cat.href;
          const isActive = cat.href && location.pathname.startsWith(cat.href);
          const buttonVariant = isActive ? "primary" : cat.variant;
          
          return (
            <Button
              key={cat.label}
              label={cat.label}
              variant={buttonVariant}
              href={isDisabled ? undefined : cat.href}
              disabled={isDisabled}
              aria-disabled={isDisabled}
              title={isDisabled ? "Coming soon" : undefined}
              className={`font sz-8 md:font-[600] ${
                isDisabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Category;
