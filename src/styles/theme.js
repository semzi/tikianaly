// On page load, check for user preference and set initial theme
if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

// Function to toggle the theme
function toggleTheme() {
  const currentTheme = localStorage.getItem('theme') || 'light'; // Default to light
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  document.documentElement.classList.remove(currentTheme === 'dark' ? 'dark' : 'light'); // Remove existing theme
  document.documentElement.classList.add(newTheme); // Apply new theme
  localStorage.setItem('theme', newTheme); // Store preference
}

// Add an event listener to the toggle switch button
document.getElementById('theme-switch').addEventListener('click', toggleTheme);