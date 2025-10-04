import { quickExamples } from '../content/examples';

let activeExampleIndex = 0;

export function getActiveExampleIndex() {
  return activeExampleIndex;
}

export function selectExample(index: number) {
  if (index === activeExampleIndex) {
    return;
  }

  if (index < 0 || index >= quickExamples.length) {
    return;
  }

  activeExampleIndex = index;
  update();
}

export function getActiveExample() {
  return quickExamples[activeExampleIndex];
}

export function getExamples() {
  return quickExamples;
}
