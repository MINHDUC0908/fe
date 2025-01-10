/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Chỉ định đường dẫn đến các tệp mà Tailwind sẽ quét
  ],
  theme: {
    extend: {
      colors: {
        primary: "#fea928",
        secondary: "#ed8900",
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        eduau: ['Edu AU VIC WA NT Pre', 'serif'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "3rem",
        }
      },
      animation: {
        'spin-2x': 'spin 2s linear infinite',
      },
    },
  },
  plugins: [],
}

