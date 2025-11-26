// components/Button.jsx
import PropTypes from 'prop-types';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonType = 'button' | 'submit' | 'reset';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  label?: string;
  type?: ButtonType;
  variant?: string;
  icon?: string;
  iconAlt?: string;
  className?: string;
  children?: ReactNode;
}

const Button = ({
  label = '',
  type = 'button',
  variant = 'primary',
  icon =``,
  iconAlt = '',
  className = '',
  children = '',
  ...props
}: ButtonProps) => {

  return (
    <button
      type={type}
      className={`${className} cursor-pointer`}
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
  secondIcon: PropTypes.string,
  children: PropTypes.node,
};

export default Button;

