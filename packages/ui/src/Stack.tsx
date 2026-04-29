import type { HTMLAttributes } from "react";
import { cn } from "./cn";

const directions = {
  row: "flex flex-row",
  col: "flex flex-col",
} as const;

const gaps = {
  none: "gap-0",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
} as const;

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: keyof typeof directions;
  gap?: keyof typeof gaps;
}

export function Stack({
  className,
  direction = "col",
  gap = "md",
  ...props
}: StackProps) {
  return (
    <div
      className={cn("flex", directions[direction], gaps[gap], className)}
      {...props}
    />
  );
}
