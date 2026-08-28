import type { ButtonHTMLAttributes } from 'react';
export function Button({ variant = 'secondary', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' }) {
  return <button className={`button ${variant} ${className}`.trim()} {...props} />;
}
