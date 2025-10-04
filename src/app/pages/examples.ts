import { quickExamplesSection } from '../sections/examples/quick-examples';
import { advancedPatternsSection } from '../sections/examples/advanced-patterns';

export function examplesPage() {
  return div(
    quickExamplesSection(),
    advancedPatternsSection()
  );
}
