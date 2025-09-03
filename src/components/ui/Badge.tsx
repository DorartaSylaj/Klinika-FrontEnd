import React from "react";
import clsx from "clsx";

type Props = {
  children: React.ReactNode;
  variant?: "default" | "urgent";
};

export const Badge = ({ children, variant = "default" }: Props) => {
  const styles = clsx(
    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
    variant === "default" && "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    variant === "urgent" && "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
  );
  return <span className={styles}>{children}</span>;
};
