import { overviewPage } from './pages/overview';
import { apiPage } from './pages/api';
import { examplesPage } from './pages/examples';
import { getStartedPage } from './pages/get-started';

export type RouteDefinition = {
  path: string;
  label: string;
  render: () => NodeModFn;
};

export const routes: RouteDefinition[] = [
  { path: 'overview', label: 'Overview', render: overviewPage },
  { path: 'get-started', label: 'Get Started', render: getStartedPage },
  { path: 'api', label: 'API Reference', render: apiPage },
  { path: 'examples', label: 'Examples', render: examplesPage },
];

export function findRoute(path: string) {
  return routes.find(route => route.path === path);
}
