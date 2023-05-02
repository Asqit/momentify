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
				shake: {
					'0%': { transform: 'translate(1px, 1px) rotate(0deg) ' },
					'10%': { transform: 'translate(-1px, -2px) rotate(-1deg)' },
					'20%': { transform: 'translate(-3px, 0px) rotate(1deg)' },
					'30%': { transform: 'translate(3px, 2px) rotate(0deg) ' },
					'40%': { transform: 'translate(1px, -1px) rotate(1deg)' },
					'50%': { transform: 'translate(-1px, 2px) rotate(-1deg)' },
					'60%': { transform: 'translate(-3px, 1px) rotate(0deg)' },
					'70%': { transform: 'translate(3px, 1px) rotate(-1deg)' },
					'80%': { transform: 'translate(-1px, -1px) rotate(1deg)' },
					'90%': { transform: 'translate(1px, 2px) rotate(0deg) ' },
					'100%': { transform: 'translate(1px, -2px) rotate(-1deg)' },
				},
			},
			animation: {
				'ping-once': 'ping-scaled 400ms cubic-bezier(0, 0, 0.2, 1) 1',
				'shake-once': 'shake 300ms linear 1',
				shake: 'shake 300ms linear infinite',
			},
		},
	},
	plugins: [],
};
