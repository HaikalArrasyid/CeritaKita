import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', asChild = false, children, ...props }, ref) => {
    
    let baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    let variantStyles = '';
    switch (variant) {
      case 'primary':
        variantStyles = 'bg-[#1A232E] text-white hover:bg-slate-800 shadow-sm';
        break;
      case 'secondary':
        variantStyles = 'bg-slate-100 text-slate-900 hover:bg-slate-200';
        break;
      case 'outline':
        variantStyles = 'border border-slate-300 bg-transparent hover:bg-slate-100 text-slate-700';
        break;
      case 'ghost':
        variantStyles = 'bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900';
        break;
    }
    
    let sizeStyles = '';
    switch (size) {
      case 'sm':
        sizeStyles = 'h-8 px-3 text-xs';
        break;
      case 'md':
        sizeStyles = 'h-10 px-4 py-2 text-sm';
        break;
      case 'lg':
        sizeStyles = 'h-12 px-8 text-base';
        break;
    }

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
Button.displayName = 'Button';
