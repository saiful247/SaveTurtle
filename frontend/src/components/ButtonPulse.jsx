import React from "react";
import PropTypes from 'prop-types';

const ButtonPulse = ({ className = "", children, pulseColor = "#5046e6", duration = "1.5s", ...props }) => {
  const combinedClassName = `relative text-center cursor-pointer flex justify-center items-center rounded-lg text-white dark:text-black bg-blue-500 dark:bg-blue-500 px-4 py-2 ${className}`;

  return (
    <button
      className={combinedClassName}
      style={{
        "--pulse-color": pulseColor,
        "--duration": duration,
      }}
      {...props}
    >
      <div className="relative z-10">{children}</div>
      <div className="absolute top-1/2 left-1/2 w-full h-full rounded-lg bg-inherit animate-pulse -translate-x-1/2 -translate-y-1/2" />
    </button>
  );
};

ButtonPulse.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  pulseColor: PropTypes.string,
  duration: PropTypes.string
};

export default ButtonPulse;