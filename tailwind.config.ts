import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      mainPink: "hsl(var(--mainPink) / <alpha-value>)",
      mainBlue: "hsl(var(--mainBlue) / <alpha-value>)",
      navyText: "hsl(var(--navyText) / <alpha-value>)",
      mainBg: "hsl(var(--mainBg) / <alpha-value>)",
      bgLight: "hsl(var(--bgLight) / <alpha-value>)",
      navyBg: "hsl(var(--navyBg) / <alpha-value>)",
      mediumGray: "hsl(var(--mediumGray) / <alpha-value>)",
      white: "hsl(var(--white) / <alpha-value>)",
      orange: "hsl(var(--orange) / <alpha-value>)",
      lightBlue: "hsl(var(--lightBlue) / <alpha-value>)",
      red: "hsl(var(--red) / <alpha-value>)",
    },
    fontFamily: {
      jost: ['"Jost"', "sans-serif"],
    },
    fontSize: {
      "heading-h1": [
        "24px",
        {
          lineHeight: "35px",
          fontWeight: "bold",
          letterSpacing: "-0.33px",
        },
      ],
      "heading-h2": [
        "20px",
        {
          lineHeight: "29px",
          fontWeight: "bold",
          letterSpacing: "-0.25px",
        },
      ],
      "heading-h3": [
        "18px",
        {
          lineHeight: "26px",
          fontWeight: "bold",
          letterSpacing: "-0.25px",
        },
      ],
      "heading-h4": [
        "14px",
        {
          lineHeight: "20px",
          fontWeight: "bold",
          letterSpacing: "-0.20px",
        },
      ],
      "body-regular": [
        "16px",
        {
          lineHeight: "23px",
          fontWeight: "regular",
        },
      ],
      "body-md": [
        "15px",
        {
          lineHeight: "22px",
          fontWeight: "regular",
        },
      ],
      "body-bold": [
        "13px",
        {
          lineHeight: "19px",
          fontWeight: "semibold",
        },
      ],
    },
    borderRadius: {
      app: "10px",
    },
    extend: {
      keyframes: {
        overlayShow: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        contentShow: {
          from: {
            opacity: "0",
            transform: "translate(-50%, -48%) scale(0.96)",
          },
          to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        },
        slideDownAndFade: {
          from: { opacity: "0", transform: "translateY(-2px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideLeftAndFade: {
          from: { opacity: "0", transform: "translateX(2px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        slideUpAndFade: {
          from: { opacity: "0", transform: "translateY(2px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideRightAndFade: {
          from: { opacity: "0", transform: "translateX(-2px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideDownAndFade:
          "slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideLeftAndFade:
          "slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideUpAndFade: "slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideRightAndFade:
          "slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionProperty: {
        height: "height",
      },
      boxShadow: {
        "task-card": "0 4px 6px 0 rgba(54, 78, 126, 0.1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
