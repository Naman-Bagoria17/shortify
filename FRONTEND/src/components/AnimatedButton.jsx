import React from 'react';
import { motion } from 'framer-motion';
// Framer Motion is a React animation library that makes it easy to add smooth, declarative animations to your components — with zero CSS keyframes and no complex setup.

// I built a reusable AnimatedButton component using React, Framer Motion, and Tailwind.It supports dynamic variants, loading state with spinner, and hover / tap animations.
const AnimatedButton = ({
  // ===== AnimatedButton Props Explanation =====
  // Props(short for properties) are the inputs to a React component.They are used to pass data from parent to child components — just like function parameters in C++.
  // children:
  //     - The main content of the button (e.g., "Login", "Submit")
  //     - Rendered inside the button visually

  // onClick:
  //     - Callback function executed when the button is clicked
  //     - Usually used to trigger form submission or API calls

  // variant:
  //     - Visual styling option for the button
  //     - Can be "primary", "danger", "ghost", etc.
  //     - Determines background, text color, hover effects, etc.

  // size:
  //     - Controls button size and padding
  //     - Options: "sm", "md", "lg", "xl"

  // disabled:
  //     - Boolean flag
  //     - If true, the button becomes unclickable and appears dimmed
  //     - Prevents user interaction.

  // loading:
  //     - Boolean flag
  //     - If true, shows a spinning loader and disables interaction
  //     - Often used during async operations (e.g., while waiting for API response)

  // icon:
  //     - Optional icon (usually a React component or SVG)
  //     - Rendered before the text content inside the button

  // className:
  //     - Extra Tailwind CSS classes passed from the parent
  //     - Used to override or add custom styles to the button

  // ...props:
  // ...props is the JavaScript spread operator used to collect and forward any additional props that weren’t explicitly destructured.
  //     - Spread operator to include any additional HTML attributes
  //     - Example: type="submit", aria-label, etc.

  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  className = '',
  ...props
}) => {
  // Button has rounded corners and is centered in its container
  // Smooth transitions are applied (e.g., for hover, active states)
  // Flex layout is used to align icon and text horizontally
  // Focus ring is clearly visible when navigating via keyboard (accessibility)
  const baseClasses = "relative overflow-hidden font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 focus:outline-none focus:ring-4 focus:ring-opacity-50";

  // Allows dynamic theming:
  // Primary: gradient button with shadow
  // Danger: red styling
  // Success: green button
  // Ghost: minimal white-transparent button
  const variants = {
    primary: "btn-gradient text-white focus:ring-blue-300 shadow-lg hover:shadow-xl",
    secondary: "bg-white/20 text-white hover:bg-white/30 focus:ring-white/30 backdrop-blur-sm",
    danger: "bg-rose-400 text-white hover:bg-rose-500 focus:ring-rose-300 shadow-lg hover:shadow-xl",
    success: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-300 shadow-lg hover:shadow-xl",
    ghost: "text-white hover:bg-white/10 focus:ring-white/20"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl"
  };

  // Visually dims the button and disables pointer events when loading/disabled
  const disabledClasses = disabled || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer";

  //Smooth hover and tap scaling, unless the button is loading/disabled
  // `hover`: when the button is hovered, it slightly scales up (1.02x) unless `disabled` or `loading` is true
  // `tap`: when the button is pressed (tapped), it slightly scales down (0.98x) unless `disabled` or `loading` is true
  const buttonVariants = {
    hover: {
      scale: disabled || loading ? 1 : 1.02,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: disabled || loading ? 1 : 0.98,
      transition: { duration: 0.1 }
    }
  };

  // When clicked, this calls the passed onClick function if not disabled/loading
  const handleClick = (e) => {
    if (disabled || loading) return;
    if (onClick) onClick(e);
  };

  //The button is built using framer-motion and Tailwind. It supports multiple variants, sizes, and visual states. 
  //During loading, it shows a spinner. There’s also a shine hover effect that animates from left to right. 
  //All animations are handled using framer-motion for smooth interaction, and styles are dynamically composed using props for full reusability
  return (
    <motion.button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {/* Content */}
      <motion.div
        className="flex items-center space-x-2 relative z-10"
        animate={{ opacity: loading ? 0.7 : 1 }}
      >
        {loading && (
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}
        {icon && !loading && <span>{icon}</span>}
        <span>{children}</span>
      </motion.div>

      {/* Shine Effect */}
      {!disabled && !loading && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
      )}
    </motion.button>
  );
};

export default AnimatedButton;
