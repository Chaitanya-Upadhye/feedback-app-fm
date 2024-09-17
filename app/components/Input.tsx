import * as React from "react";

import { cn } from "../utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  extra?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label = "",
      helperText = "",
      type = "text",
      extra = <></>,
      ...props
    },
    ref
  ) => {
    const [isInvalid, setIsInvalid] = React.useState(false);
    return (
      <>
        {label ? (
          <label
            className={`block text-navyText text-heading-h4 ${
              helperText ? "mb-[2px]" : `mb-4`
            }`}
          >
            {label}
          </label>
        ) : null}
        {helperText && (
          <span className="text-body-md text-mediumGray inline-block mb-4">
            {helperText}
          </span>
        )}
        <div
          className={cn(
            `relative border border-white  rounded-[5px] px-4 min-h-[40px] py-2 bg-mainBg w-full block outline-none hover:border-mainBlue  focus:border-mainBlue  invalid:${
              isInvalid ? "border-red hover:border-red" : ""
            }${props.disabled ? " cursor-not-allowed opacity-35" : ""}`,
            className
          )}
        >
          {extra}
          <Comp
            type={type}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setIsInvalid(!e.target.checkValidity());
            }}
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
              setIsInvalid(!e.currentTarget.checkValidity());
            }}
            ref={ref}
            {...props}
          />
          {isInvalid ? (
            <span className="text-body-m text-red absolute right-4 top-3">
              {"Can't be empty"}
            </span>
          ) : null}
        </div>
      </>
    );
  }
);
const Comp = (
  props: React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & {
    type?: "text" | "text-area";
  }
) => {
  return props.type === "text-area" ? (
    <textarea {...props}></textarea>
  ) : (
    <input {...props}></input>
  );
};
Input.displayName = "Input";

export { Input };

// className="rounded px-4 min-h-[40px] py-2 w-full block outline-none border border-mediumGrey/25 focus:border-mainPurple   invalid:border-red"
