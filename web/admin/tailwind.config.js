/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563c9",
          dark: "#173d73",
          light: "#dbeafe"
        },
        success: {
          DEFAULT: "#1f9d67",
          light: "#dcfce7"
        },
        warning: {
          DEFAULT: "#d28b16",
          light: "#fef9c3"
        },
        danger: {
          DEFAULT: "#cc425b",
          light: "#fee2e2"
        },
        info: {
          DEFAULT: "#2c76e2",
          light: "#dbeafe"
        },
        sidebar: "#0e2037",
        surface: "rgba(255,255,255,0.82)",
        "bg-app": "#eef4f9"
      },
      fontFamily: {
        sans: ["Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif"]
      },
      boxShadow: {
        card: "0 4px 24px rgba(16,32,51,0.08)",
        modal: "0 24px 64px rgba(16,32,51,0.18)"
      },
      borderRadius: {
        card: "14px",
        modal: "18px"
      }
    }
  },
  plugins: []
};
