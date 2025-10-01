import { typeSystemSection } from '../sections/api/type-system';
import { apiReferenceSection } from '../sections/api/reference';
import { conceptsSection } from '../sections/api/concepts';
import { debuggingSection } from '../sections/api/debugging';

export function apiPage() {
  return div(
    { className: 'mx-auto flex max-w-6xl flex-col gap-16 px-6 py-24' },
    typeSystemSection(),
    apiReferenceSection(),
    conceptsSection(),
    debuggingSection()
  );
}
