export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        obsidian: "#0A0A0A",
        surface: "#111111",
        card: "#161616",
        accent: "#FF5500",
        accentHover: "#E04800",
      },
      letterSpacing: {
        tighter: "-0.04em",
        tight: "-0.025em",
      },
    },
  },
};
