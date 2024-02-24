import { type Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const flex2 = {
  ".flex-2": {
    flex: "2",
  },
};

const flex3 = {
  ".flex-3": {
    flex: "3",
  },
};

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities(flex2);
      addUtilities(flex3);
    }),
  ],
  darkMode: "selector",
} satisfies Config;
