import PropTypes from "prop-types";

const Checkbox = ({
  mode = "",
  className = "checkbox",
  ...props
}) => {
  return (
    <input
      type="checkbox"
      className={`${className} ${mode} checked:bg-check`}
      {...props}
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

