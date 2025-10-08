import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#A0D2DB",          // 밝은 파스텔 블루
        "primary-dark": "#5EAAA8",   // 진한 민트톤 블루
        "background-base": "#F8F9FA", // 페이지 배경
        text: "#212529",             // 본문 텍스트
        "text-subtle": "#6C757D",    // 서브 텍스트
        border: "#E9ECEF",           // 경계선
        card: "#FFFFFF",             // 카드/헤더 배경
      },
    },
  },
  plugins: [],
};

export default config;
