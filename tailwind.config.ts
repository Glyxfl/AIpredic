import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ==================== 神秘东方风格配色 ==================== */
        mystical: {
          /* 主色调 - 紫色系 */
          primary: '#8b5cf6',
          'primary-dark': '#7c3aed',
          'primary-light': '#a78bfa',
          
          /* 点缀色 - 金色系 */
          accent: '#f59e0b',
          'accent-light': '#fbbf24',
          'accent-dark': '#d97706',
          
          /* 背景色 - 渐变层次 */
          dark: '#0f0a1f',
          medium: '#1e1b2e',
          light: '#2d2a3d',
          'light-hover': '#3d3a4d',
        },
        
        /* ==================== 主题配色方案 ==================== */
        theme: {
          blue: '#3554BD',
          deepPurple: '#291F5E',
          purple: '#80439F',
          pinkLight: '#FA7ABE',
          pink: '#E144AD',
        },
        
        /* ==================== 原有颜色（保留向后兼容） ==================== */
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
      },
      
      /* ==================== 自定义动画 ==================== */
      animation: {
        'float': 'float 8s infinite ease-in-out',
        'shimmer': 'shimmer 3s linear infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'message-slide-in': 'messageSlideIn 0.4s ease-out forwards',
        'slide-from-right': 'slideFromRight 0.3s ease-out',
        'rotate': 'rotate 20s linear infinite',
        'ripple': 'ripple 0.4s ease-out',
      },
      
      /* ==================== 关键帧动画 ==================== */
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) scale(1)', opacity: '0.6' },
          '50%': { transform: 'translateY(-20px) scale(1.2)', opacity: '1' },
        },
        shimmer: {
          'to': { backgroundPosition: '200% center' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.1)' },
        },
        messageSlideIn: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        slideFromRight: {
          'from': { opacity: '0', transform: 'translateX(20px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        rotate: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
      },
      
      /* ==================== 边框半径 ==================== */
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      
      /* ==================== 背景渐变 ==================== */
      backgroundImage: {
        'mystical-gradient': 'linear-gradient(135deg, #8b5cf6 0%, #f59e0b 100%)',
        'mystical-gradient-reverse': 'linear-gradient(135deg, #f59e0b 0%, #8b5cf6 100%)',
        'gold-shimmer': 'linear-gradient(135deg, #fcd34d 0%, #f59e0b 25%, #f97316 50%, #f59e0b 75%, #fcd34d 100%)',
      },
      
      /* ==================== 阴影效果 ==================== */
      boxShadow: {
        'mystical': '0 4px 30px rgba(0, 0, 0, 0.3), 0 0 40px rgba(139, 92, 246, 0.1)',
        'mystical-glow': '0 0 40px rgba(245, 158, 11, 0.3)',
        'mystical-lg': '0 8px 50px rgba(0, 0, 0, 0.4), 0 0 80px rgba(139, 92, 246, 0.15)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config