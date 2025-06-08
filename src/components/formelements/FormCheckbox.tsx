import React from "react";
import PropTypes from "prop-types";

const Checkbox = ({
  isChecked = false,
  isDisabled = false,
  mode = "",
  className = "checkbox",
  ...props
}) => {
  return (
    <input
      type="checkbox"
      className={`${className} ${mode} checked:bg-check`}
    //   {...(isChecked !== undefined ? { checked: isChecked } : {})}
    //   {...(isDisabled !== undefined ? { disabled: isDisabled } : {})}
    //   {...props}
    />
  );
};

Checkbox.propTypes = {
  isChecked: PropTypes.bool,
  isDisabled: PropTypes.bool,
  mode: PropTypes.string,
  className: PropTypes.string,
};

export default Checkbox;
