import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';

const languageAliases: Record<string, string> = {
  ts: 'typescript',
  typescript: 'typescript',
  js: 'javascript',
  javascript: 'javascript',
  bash: 'bash',
  sh: 'bash',
  shell: 'bash',
  json: 'json',
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function codeBlock(language: string, snippet: string) {
  const content = snippet.trim();
  const normalized = languageAliases[language] ?? language;
  const grammar = Prism.languages[normalized];
  const highlighted = grammar
    ? Prism.highlight(content, grammar, normalized)
    : escapeHtml(content);

  return pre(
    {
      className: 'w-full overflow-x-auto p-5 ring-2 backdrop-blur transition-all duration-200 hover:ring-opacity-80',
      style: `
        background-color: var(--code-bg);
        border-color: var(--border-color);
        border-radius: var(--vc-radius-lg);
        box-shadow: var(--vc-inner-hi), var(--vc-inner-sh);
        ring-color: var(--vc-accent-mint);
        ring-opacity: 0.3;
      `
    },
    code(
      {
        className: `block w-full text-sm leading-relaxed language-${normalized}`,
        style: 'color: var(--code-text);',
        innerHTML: highlighted,
      }
    )
  );
}
