/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        // 🔵 PRIMARY (Deep Blue Brand)
        primary: {
          50: '#f0f4fa',
          100: '#e1e9f6',
          200: '#c8d8ed',
          300: '#a1c0e1',
          400: '#75a1d1',
          500: '#1b3b6b', // main brand
          600: '#18345e', // buttons
          700: '#142b4e',
          800: '#10223e',
          900: '#0d1a2f',
        },

        // 🟠 ACCENT (CTA / Highlights)
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // highlight
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },

        // 🌙 DARK MODE SYSTEM (NEW — IMPORTANT)
        darkbg: '#0b1220',     // main background
        darkcard: '#111827',   // cards / containers
        darkcard2: '#1f2937',  // hover / layered UI

        darktext: '#e5e7eb',   // primary text (bright)
        darkmuted: '#9ca3af',  // secondary text
        darkborder: '#374151', // borders

        // ✨ BRAND GLOW (for premium feel)
        glowBlue: 'rgba(27,59,107,0.35)',
        glowOrange: 'rgba(249,115,22,0.35)',
      },

      fontFamily: {
        sans: ['"Poppins"', 'system-ui', 'sans-serif'],
      },

      // 🎬 ANIMATIONS (unchanged + safe)
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-down': 'slideDown 0.4s ease-out forwards',
        'slide-right': 'slideRight 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        float: 'float 3s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        'count-up': 'countUp 2s ease-out forwards',
        'fly-3d-1': 'fly3d-1 18s cubic-bezier(.28,.08,.72,.92) infinite',
        'fly-3d-2': 'fly3d-2 18s cubic-bezier(.28,.08,.72,.92) infinite',
        'star-twinkle': 'starTwinkle 2s ease-in-out infinite',
        'cloud-drift': 'cloudDrift 60s linear infinite',
        'nav-entrance': 'navSlideDown 0.4s cubic-bezier(.22,1,.36,1) both',
      },

      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        navSlideDown: {
          from: { opacity: '0', transform: 'translateY(-100%)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },

      // 🌈 BACKGROUNDS
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern':
          "url(\"data:image/svg+xml,%3Csvg ... %3C/svg%3E\")",
      },

      // 💡 SHADOW SYSTEM (UPDATED for dark mode)
      boxShadow: {
        card: '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.15)',

        // 🔥 NEW PREMIUM SHADOWS
        glow: '0 0 20px rgba(27,59,107,0.35)',
        'glow-lg': '0 0 40px rgba(27,59,107,0.25)',
        'glow-accent': '0 0 25px rgba(249,115,22,0.25)',

        // 🌙 DARK MODE SHADOW
        'dark-card': '0 10px 30px rgba(0,0,0,0.6)',
      },
    },
  },

  plugins: [],
};