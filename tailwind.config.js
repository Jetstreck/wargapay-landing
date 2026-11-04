/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0b0b0f",
                neonBlue: "#2c3e50", // Placeholder, will refine
            }
        },
    },
    plugins: [],
}
