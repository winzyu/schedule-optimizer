import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Keep existing gradient configurations
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      // Add custom variable configurations
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        'text-dark': 'var(--text-dark)',
        'text-light': 'var(--text-light)',
      },
      spacing: {
        tiny: 'var(--tiny-spacer)',
        small: 'var(--small-spacer)',
        medium: 'var(--medium-spacer)',
        large: 'var(--large-spacer)',
      },
      borderRadius: {
        custom: 'var(--b-radius)',
      },
      height: {
        navbar: 'var(--navbar-height)',
      },
    },
  },
  plugins: [],
};

export default config;
