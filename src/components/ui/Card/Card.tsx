/*
Genanvendelig kort som bruges til at vise information i en boks
i et grid
*/

import React from "react";
import styles from "./Card.module.css";

interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Card = ({ children, onClick, className = "" }: CardProps) => {
  // Kombinerer den faste 'card' klasse med eventuelle ekstra klasser
  const cardClasses = `${styles.card} ${className}`;

  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
