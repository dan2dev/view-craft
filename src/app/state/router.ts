type RouteListener = (path: string) => void;

const DEFAULT_ROUTE = 'overview';

let currentPath = resolveHash(window.location.hash || DEFAULT_ROUTE);
const listeners = new Set<RouteListener>();

function resolveHash(hash: string) {
  const cleaned = hash.replace(/^#/, '').replace(/^\/+/, '');
  return cleaned || DEFAULT_ROUTE;
}

function setHash(path: string) {
  const formatted = `#${path}`;
  if (window.location.hash !== formatted) {
    window.location.hash = formatted;
  }
}

function notify() {
  const next = currentPath;
  for (const listener of listeners) {
    listener(next);
  }
}

export function getCurrentPath() {
  return currentPath;
}

export function navigateTo(target: string) {
  const nextPath = resolveHash(target.startsWith('#') ? target : `#${target}`);

  if (nextPath === currentPath) {
    setHash(currentPath);
    notify();
    update();
    return;
  }

  currentPath = nextPath;
  setHash(currentPath);
  notify();
  update();
}

export function subscribe(listener: RouteListener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function initRouter() {
  if (!window.location.hash) {
    setHash(currentPath);
  }

  window.addEventListener('hashchange', () => {
    const nextPath = resolveHash(window.location.hash);
    if (nextPath === currentPath) {
      return;
    }

    currentPath = nextPath;
    notify();
    update();
  });

  notify();
}
