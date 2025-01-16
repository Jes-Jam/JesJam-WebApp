import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
				'fire-red': '#ff4500',
        'fire-orange': '#ff8c00',
        'fire-yellow': '#ffd700',
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		keyframes: {
			'sway': {
				'0%, 100%': { transform: 'translateX(0px)' },
				'50%': { transform: 'translateX(5px)' },
			},
			'bounce-daisy': {
				'0%, 100%': { transform: 'translateY(0px)' },
				'50%': { transform: 'translateY(5px)' },
			},
			'sway-grass': {
				'0%, 100%': { transform: 'translateX(0px)' },
				'50%': { transform: 'translateX(3px)' },
			}, 
			shine: {
				'0%': { transform: 'translateX(-100%)' },
				'100%': { transform: 'translateX(100%)' }
			},
			flicker: {
				'0%, 100%': { opacity: 0.8, transform: 'translateY(0) scale(1)' },
				'50%': { opacity: 1, transform: 'translateY(-5px) scale(1.1)' },
			},
			flicker1: {
				'0%, 100%': { opacity: 0.7, transform: 'translateY(0) scale(1)' },
				'50%': { opacity: 1, transform: 'translateY(-4px) translateX(-2px) scale(1.1)' },
			},
			flicker2: {
				'0%, 100%': { opacity: 0.6, transform: 'translateY(0) scale(1)' },
				'50%': { opacity: 1, transform: 'translateY(-3px) translateX(1px) scale(1.1)' },
			},
			wave: {
				'0%, 100%': { transform: 'translateX(0)' },
				'50%': { transform: 'translateX(5px)' },
			},
		},
		animation: {
			'sway': 'sway 4s ease-in-out infinite',
			'bounce-daisy': 'bounce-daisy 6s ease-in-out infinite',
			'sway-grass': 'sway-grass 4s ease-in-out infinite',
			shine: 'shine 2s ease-in-out infinite',
			flicker: 'flicker 4s infinite',
			flicker1: 'flicker1 3.8s infinite',
			flicker2: 'flicker2 3.5s infinite',
			wave: 'wave 6s ease-in-out infinite',
		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
