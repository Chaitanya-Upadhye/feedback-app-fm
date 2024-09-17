import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/utils";

const buttonVariants = cva("", {
  variants: {
    variant: {
      destructive:
        " rounded-app bg-red text-body-m text-white hover:bg-red/10 transition-all hover:bg-redHover disabled:opacity-20",
      primary:
        "rounded-app bg-mainPink text-white hover:bg-mainPurpleHover transition-all disabled:opacity-20 ",

      secondary:
        " rounded-app bg-mainPurpleSecondary bg-navyBg text-white transition-all disabled:opacity-20 ",
    },
    size: {
      sm: "min-h-[40px] text-body-m py-2 px-6 rounded-3xl",
      lg: "min-h-[48px] text-heading-m py-3 px-6 rounded-3xl",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "lg",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & VariantProps<typeof buttonVariants>
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };
