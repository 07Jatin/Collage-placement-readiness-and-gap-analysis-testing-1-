/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            borderRadius: {
                '3xl': '1.5rem',
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
            spacing: {
                '84': '21rem',
            },
            colors: {
                indigo: {
                    950: '#1e1b4b',
                }
            }
        },
    },
    plugins: [],
}
