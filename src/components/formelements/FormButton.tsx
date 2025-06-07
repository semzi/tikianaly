import React from 'react';
import { Button } from "@/components/ui/button";

interface FormButtonProps {
  type?: "button" | "submit" | "reset";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function FormButton({
  type = "button",
  variant = "default",
  size = "default",
  className,
  children,
  onClick,
  disabled = false
}: FormButtonProps) {
  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
} 