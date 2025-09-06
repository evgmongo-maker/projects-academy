import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  style = {},
  className = '',
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
      disabled={disabled}
      style={{
        background: 'linear-gradient(90deg,#43e97b 0%, #2563eb 100%)',
        color: '#fff',
        fontWeight: 800,
        border: 'none',
        borderRadius: 14,
        padding: '0.7rem 1.7rem',
        fontSize: 22,
        boxShadow: '0 2px 12px rgba(67,233,123,0.10)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        transition: 'background 0.2s, box-shadow 0.2s',
        opacity: disabled ? 0.6 : 1,
        letterSpacing: 1,
        textShadow: '0 2px 8px #2563eb22',
        ...style,
      }}
    >
      {children}
    </button>
  );
};

export default Button;
