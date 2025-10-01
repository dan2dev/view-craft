import { overviewPage } from './pages/overview';
import { apiPage } from './pages/api';
import { examplesPage } from './pages/examples';

export type RouteDefinition = {
  path: string;
  label: string;
  render: () => NodeModFn;
};

export const routes: RouteDefinition[] = [
  { path: 'overview', label: 'Overview', render: overviewPage },
  { path: 'api', label: 'API Reference', render: apiPage },
  { path: 'examples', label: 'Examples', render: examplesPage },
];

export function findRoute(path: string) {
  return routes.find(route => route.path === path);
}
