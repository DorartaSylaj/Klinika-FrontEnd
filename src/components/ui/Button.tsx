import React from "react";
import clsx from "clsx";

type Variant = "default" | "green" | "orange" | "red";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function Button({ variant = "default", className, ...props }: Props) {
  const base =
    "px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition";
  const variants: Record<Variant, string> = {
    default: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    green: "bg-green-500 hover:bg-green-600 text-white",
    orange: "bg-orange-500 hover:bg-orange-600 text-white",
    red: "bg-red-500 hover:bg-red-600 text-white",
  };

  return <button className={clsx(base, variants[variant], className)} {...props} />;
}
