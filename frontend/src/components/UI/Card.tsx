import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', hover = false, onClick }: CardProps) {
  const Component = motion.div;
  
  return (
    <Component
      className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${
        hover ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
      whileHover={hover ? { 
        y: -4, 
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
      } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
    </Component>
  );
}