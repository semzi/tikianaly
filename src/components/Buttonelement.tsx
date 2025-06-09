import { twMerge } from "tw-merge";
import PropTypes from "prop-types";

/**
 * Buttonelement
 * Renders a button styled as primary or outline.
 * If an href is provided, wraps the button in an anchor tag for navigation.
 */
export const Buttonelement = ({
  label = "",
  variant = "primary",
  href = "",
  className = "",
  children = "",
  ...props
}) => {
  const button = (
    <button
      className={twMerge(
        `${variant === "primary" ? "btn-primary-sm" : "btn-outline-sm"} ${
          className || ""
        }`
      )}
      {...props}
    >
      {label && <span>{label}</span>}
      {children}
    </button>
  );

  // If href is provided, wrap the button in a link
  return href ? (
    <a href={href} className="inline-block">
      {button}
    </a>
  ) : (
    button
  );
};

Buttonelement.propTypes = {
  label: PropTypes.string,
  variant: PropTypes.string,
  href: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Buttonelement;
