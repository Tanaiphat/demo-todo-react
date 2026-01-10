import type { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
  secondary: 'bg-slate-600 hover:bg-slate-700 text-slate-100',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
};

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed ${
        variantStyles[variant]
      } ${
        variant === 'primary'
          ? 'focus:ring-indigo-500'
          : variant === 'danger'
          ? 'focus:ring-red-500'
          : 'focus:ring-slate-500'
      }`}
    >
      {children}
    </button>
  );
}
