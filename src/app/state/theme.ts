type Theme = 'light' | 'dark';

let currentTheme: Theme = getInitialTheme();
const subscribers = new Set<(theme: Theme) => void>();

function getInitialTheme(): Theme {
  // Check localStorage first
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  // Otherwise, use system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

export function getTheme(): Theme {
  return currentTheme;
}

export function setTheme(theme: Theme) {
  currentTheme = theme;
  applyTheme(theme);
  subscribers.forEach(fn => fn(theme));
}

export function toggleTheme() {
  setTheme(currentTheme === 'light' ? 'dark' : 'light');
}

export function subscribeToTheme(fn: (theme: Theme) => void) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

// Initialize theme on module load
applyTheme(currentTheme);

// Listen to system preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  // Only auto-switch if user hasn't manually set a preference
  const stored = localStorage.getItem('theme');
  if (!stored) {
    setTheme(e.matches ? 'dark' : 'light');
  }
});
