import { typeSystemSection } from '../sections/api/type-system';
import { apiReferenceSection } from '../sections/api/reference';
import { conceptsSection } from '../sections/api/concepts';
import { debuggingSection } from '../sections/api/debugging';

export function apiPage() {
  return div(
    typeSystemSection(),
    apiReferenceSection(),
    conceptsSection(),
    debuggingSection()
  );
}
