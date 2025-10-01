import { quickExamplesSection } from '../sections/examples/quick-examples';
import { advancedPatternsSection } from '../sections/examples/advanced-patterns';

export function examplesPage() {
  return div(
    { className: 'mx-auto flex max-w-6xl flex-col gap-16 px-6 py-24' },
    quickExamplesSection(),
    advancedPatternsSection()
  );
}
