import React from 'react';

const FormInput = ({
  label = 'Label',
  type = 'text',
  placeholder = '',
  icon = '',
  className = '',
  containerClass = '',
  inputClass = '',
  ...props
}) => {
  return (
    <div className={`${containerClass}`}>
      {label && <p className="text-[14px] sm:text-[15px] md:text-[16px] mb-2">{label}</p>}
      
      <div
        className={`input flex items-center gap-3 h-[50px] sm:h-[50px] md:h-[56px] 
        w-full max-w-full sm:max-w-md md:max-w-lg 
        border border-snow-200 px-3 sm:px-4 mb-4 rounded-[8px] ${className}`}
      >
        {icon && (
          <div className="p-1">
            <img src={icon} alt="" className="" />
          </div>
        )}

        {icon && <div className="py-3 w-[2px] bg-gray-200"></div>}

        <input
          type={type}
          placeholder={placeholder}
          className={`w-full text-[13px] sm:text-[14px] md:text-[15px] outline-none border-none ${inputClass}`}
          {...props}
        />
      </div>
    </div>
  );
};

export default FormInput;
