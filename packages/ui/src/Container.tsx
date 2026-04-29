import * as React from "react";
import { cn } from "./cn";

const maxWidthClass = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "7xl": "max-w-7xl",
} as const;

export interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  as?: keyof React.JSX.IntrinsicElements;
  maxWidth?: keyof typeof maxWidthClass;
}

export function Container({
  as = "div",
  className,
  maxWidth = "7xl",
  ...props
}: ContainerProps) {
  const Component = as as React.ElementType;
  return (
    <Component
      className={cn(
        "mx-auto w-full px-6",
        maxWidthClass[maxWidth],
        className,
      )}
      {...props}
    />
  );
}
