import React from 'react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  shimmerWidth?: number;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 5,
  className = '',
}) => {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`inline bg-clip-text text-transparent bg-[linear-gradient(110deg,#8cf4ea,45%,#ffffff,55%,#8cf4ea)] bg-[length:200%_100%] max-w-full break-words ${
        disabled ? '' : 'animate-shiny-text'
      } ${className}`}
      style={{
        animationDuration,
      }}
    >
      {text}
    </span>
  );
};
