// components/Button.jsx
import React from 'react';
import PropTypes from 'prop-types';

const Button = ({
  label = '',
  type = 'button',
  variant = 'primary',
  icon =``,
  iconAlt = '',
  className = '',
  children = '',
  ...props
}) => {

  return (
    <button
    type={type}
      className={`${className}`}
      {...props}
    >
      {icon && <img src={icon} alt={iconAlt} className="h-5 w-5" />}
      {label && <span>{label}</span>}
      {children}
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  variant: PropTypes.string,
  icon: PropTypes.string,
  iconAlt: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Button;
