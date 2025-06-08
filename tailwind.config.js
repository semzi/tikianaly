// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontSize: {
        'sz-1': 'var(--font-sz-1)',
        'sz-2': 'var(--font-sz-2)',
        'sz-3': 'var(--font-sz-3)',
        'sz-4': 'var(--font-sz-4)',
        'sz-5': 'var(--font-sz-5)',
        'sz-6': 'var(--font-sz-6)',
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
      },
       backgroundImage: {
        'check': "url(\"data:image/svg+xml,%3csvg fill='none' stroke='white' stroke-width='3' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5 13l4 4L19 7'/%3e%3c/svg%3e\")",
      },
    },
  },
  plugins: [],
}
// This configuration file extends Tailwind CSS to include custom font sizes and a custom font family for display text.
// The custom font sizes are defined using CSS variables, allowing for easy adjustments in a central location.  