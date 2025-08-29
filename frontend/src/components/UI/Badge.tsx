import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant: 'healthy' | 'disease' | 'pest';
  size?: 'sm' | 'md';
}

export function Badge({ children, variant, size = 'md' }: BadgeProps) {
  const variants = {
    healthy: 'bg-green-100 text-green-800',
    disease: 'bg-red-100 text-red-800',
    pest: 'bg-amber-100 text-amber-800'
  };
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
}