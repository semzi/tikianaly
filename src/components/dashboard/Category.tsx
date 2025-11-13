import Button from "../ui/Button";
import categories from "../../data/categoryList";

export const Category = () => {
  return (
    <div style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE 10+
        }}>
      <div
        className="flex hide-scrollbar dark:bg-[#0D1117]  w-full gap-2 overflow-x-auto overflow-y-hidden page-padding-x pb-1"
      >
        {categories.map((cat) => (
          <Button
            key={cat.label}
            label={cat.label}
            variant={cat.variant}
            href={cat.href}
            className="font sz-8 md:font-[600]"
          />
        ))}
      </div>
    </div>
  );
};

export default Category;
