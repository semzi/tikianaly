import Buttonelement from "../Buttonelement";
import categories from "../../data/categoryList";

export const Category = () => {
  return (
    <div style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE 10+
        }}>
      <div
        className="flex hide-scrollbar dark:bg-[#0D1117]  w-full gap-3 overflow-x-auto overflow-y-hidden page-padding-x pb-3"
      >
        {categories.map((cat) => (
          <Buttonelement
            key={cat.label}
            label={cat.label}
            variant={cat.variant}
            href={cat.href}
            className="font md:font-[600]"
          />
        ))}
      </div>
    </div>
  );
};

export default Category;
