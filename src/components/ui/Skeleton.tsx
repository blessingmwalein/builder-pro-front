import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rounded?: string;
}

export function Skeleton({ className, rounded = "rounded-md", ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200",
        rounded,
        className
      )}
      {...props}
    />
  );
}
