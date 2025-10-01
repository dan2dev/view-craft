import { heroSection } from '../sections/home/hero';
import { highlightSection } from '../sections/home/highlights-section';
import { installationSection } from '../sections/home/installation';
import { bestPracticesSection } from '../sections/home/best-practices';
import { navigateTo } from '../state/router';

export function overviewPage() {
  return div(
    heroSection(navigateTo),
    div(
      { className: 'mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16' },
      highlightSection(),
      installationSection(),
      bestPracticesSection()
    )
  );
}
