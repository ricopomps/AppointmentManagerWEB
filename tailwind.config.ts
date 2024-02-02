import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        theme: {
          primary: "#DDB076",
          secondary: "#151515",
          accent: "#44515C",
          neutral: "#EBECEA",
          "base-100": "#44515C",
          info: "#DDB076",
          success: "#68A057",
          warning: "#DDB076",
          error: "#DEB4A9",
          body: {
            "background-color": "#44515C",
          },
        },
      },
    ],
  },
};
export default config;
