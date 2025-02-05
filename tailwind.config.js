/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  content: ["app/**/*.{tsx,jsx,ts,js}", "components/**/*.{tsx,jsx,ts,js}"],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
		colors: {
			"baby-powder": "#FFFDF9",
			"almond": "#FDE4D2",
			"jasmine": "#FFD87E",
			"coral-pink": "#F18B7E",
			"cambridge-blue": "#97B8A5",
			"dark-slate-green": "#183A36"
		},
		fontFamily: {
			Sirenia: ["sirenia", "sans-serif"],
			Nunito: ["Nunito", "sans-serif"],
		},
		fontWeight: {
			light: "300",
			normal: "400",
			medium: "500",
			semibold: "600",
			bold: "700",
			extrabold: "800",
			black: "900",
    },
		fontStyle: {
			italic: ['italic'],
		},
		zIndex: {
			'999': '999',
		}
  },
  plugins: [],
};
