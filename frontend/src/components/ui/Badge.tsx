import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'anonymous' | 'category' | 'success' | 'warning' | 'destructive';
}

export const Badge = ({ className = '', variant = 'default', children, ...props }: BadgeProps) => {
  let baseStyles = 'inline-flex items-center font-semibold rounded-full';
  
  let variantStyles = '';
  switch (variant) {
    case 'default':
      variantStyles = 'px-2.5 py-0.5 text-xs bg-slate-100 text-slate-800';
      break;
    case 'anonymous':
      variantStyles = 'text-xs font-mono tracking-wider text-slate-600 flex items-center gap-1.5';
      break;
    case 'category':
      variantStyles = 'uppercase tracking-[0.15em] text-[11px] text-slate-500';
      break;
    case 'success':
      variantStyles = 'px-2.5 py-0.5 text-xs bg-emerald-100 text-emerald-800';
      break;
    case 'warning':
      variantStyles = 'px-2.5 py-0.5 text-xs bg-amber-100 text-amber-800';
      break;
    case 'destructive':
      variantStyles = 'px-2.5 py-0.5 text-xs bg-rose-100 text-rose-800';
      break;
  }

  return (
    <div className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};
