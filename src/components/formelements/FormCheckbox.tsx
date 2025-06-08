import PropTypes from "prop-types";

const Checkbox = ({
  mode = "",
  className = "checkbox",
}) => {
  return (
    <input
      type="checkbox"
      className={`${className} ${mode} checked:bg-check`}
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
