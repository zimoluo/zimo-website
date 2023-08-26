import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'zimo-bg-light': "url('/zimo-bg-light-static.svg')",
        'photos-bg-light': "url('/photos-pane.svg')",
        'blog-bg-light': "url('/blog-pane.svg')",
        'projects-bg-light': "url('/projects-pane.svg')",
        'about-bg-light': "url('/about-pane-base.svg')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        'arial-black': ['"Arial Black"', 'sans-serif'],
        'arial': ['"Arial"', 'sans-serif']
      },
      animation: {
        'zimo-scale-1': 'move-about-bg 40s ease-in-out infinite',
        'zimo-scale-2': 'move-about-bg 60s ease-in-out infinite',
        'move-bg-1': 'move-zimo-bg 60s ease-in-out infinite',
        'move-bg-2': 'move-zimo-bg-reversed 40s ease-in-out infinite',
        'move-bg-3': 'move-zimo-bg 50s ease-in-out infinite',
        'move-glass-group-1': 'move-glass-group 40s ease-in-out infinite',
        'move-glass-group-2': 'move-glass-group 50s ease-in-out infinite',
        'move-glass-group-3': 'move-glass-group 30s ease-in-out infinite',
        'move-glass-individual-1': 'move-glass-individual-2 60s ease-in-out infinite',
        'move-glass-individual-2': 'move-glass-individual-1 70s ease-in-out infinite',
        'move-glass-individual-3': 'move-glass-individual-1 100s ease-in-out infinite',
        'move-glass-individual-4': 'move-glass-individual-2 80s ease-in-out infinite',
        'move-glass-individual-5': 'move-glass-individual-2 70s ease-in-out infinite',
        'move-glass-individual-6': 'move-glass-individual-2 100s ease-in-out infinite',
        'move-glass-individual-7': 'move-glass-individual-1 80s ease-in-out infinite',
        'move-glass-individual-8': 'move-glass-individual-2 90s ease-in-out infinite',
        'move-glass-individual-9': 'move-glass-individual-1 90s ease-in-out infinite',
        'move-glass-individual-10': 'move-glass-individual-1 60s ease-in-out infinite',
        'move-painting-glow': 'move-painting-glow 40s ease-in-out infinite',
        'spin-cog': 'spin 30s linear infinite',
        'spin-cog-reverse': 'spin 30s linear infinite reverse',
        'spin-revolution': 'spin 80s linear infinite'
      },
      boxShadow: {
        'favicon-glow': 'inset 0 0 15px 0px #ffffff, 0 0 15px 2px #ffffff',
      },
    }
  },
  variants: {
    extend: {
      opacity: ['group-hover'],
      transform: ['group-hover']
    }
  },
  plugins: [],
  purge: {
    options: {
      safelist: [
        'text-neutral-900',
        'text-orange-900',
        'text-fuchsia-900',
        'text-teal-900',
        'text-sky-900',
        'border-neutral-900',
        'border-orange-900',
        'border-fuchsia-900',
        'border-teal-900',
        'border-sky-900',
      ],
    },
  }
}
export default config
