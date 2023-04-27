/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			keyframes: {
				wiggle: {
					'0%, 100%': { transform: 'rotate(-3deg)' },
					'50%': { transform: 'rotate(3deg)' },
				},
				'ping-scaled': {
					'50%, 75% ': {
						transform: 'scale(1.25)',
					},
					'100%': { transform: 'scale(1)' },
				},
			},
			animation: {
				'ping-once': 'ping-scaled 400ms cubic-bezier(0, 0, 0.2, 1) 1',
			},
		},
	},
	plugins: [],
};
