import React from "react";
import styles from "./Button.module.css";

// Definerer de props, vores knap kan modtage
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger"; // Forskellige stilarter
}

const Button = ({ children, variant = "primary", ...props }: ButtonProps) => {
  // Vælger CSS-klasse baseret på variant-prop
  const buttonClass = `${styles.btn} ${styles[variant]}`;

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
};

export default Button;
