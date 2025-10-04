import { installationStepsSection } from '../sections/get-started/installation-steps';
import { quickStartSection } from '../sections/get-started/quick-start';
import { typescriptSetupSection } from '../sections/get-started/typescript-setup';

export function getStartedPage() {
  return div(
    installationStepsSection(),
    quickStartSection(),
    typescriptSetupSection()
  );
}
