import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundColor: {
        'background': '#f2f6fc',
        'btn-orange': '#ED7D31',
      },
      colors: {
        'orange-1': "#FF5B22",
        'orange-2': "#EA580C",
        'orange-3': "#FF9130",
        'orange-4': "#DE8F5F",
        'orange-5': "#F9B572",
        'orange-6': "#FCE09B",
        'orange-7': "#F1EB90",
        'green-1': "#004225",
        'green-2': "#186F65",
        'green-3': "#557C55",
        'green-4': "#A6CF98",
        'green-5': "#79AC78",
        'green-6': "#B0D9B1",
        'green-7': "#9FBB73",
        'green-8': "#D0E7D2",
        'green-9': "#F2FFE9",
      },
      screens: {
        xs: "320px",
        sm: "375px",
        sml: "576px",
        md: "667px",
        mdl: "769px",
        lg: "960px",
        lgl: "1024px",
        xl: "1280px",
      },
      fontFamily: {
        bodyFont: ["Kanit", "sans-serif"],
        titleFont: ["Kanit", "sans-serif"],
      },
    },
  },
  plugins: [],
}
export default config
