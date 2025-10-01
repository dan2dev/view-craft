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
    { className: 'w-full overflow-x-auto rounded-xl p-4 ring-1 backdrop-blur transition-colors', style: 'background-color: var(--code-bg); border-color: var(--border-color);' },
    code(
      {
        className: `block w-full text-sm leading-relaxed language-${normalized}`,
        style: 'color: var(--code-text);',
        innerHTML: highlighted,
      }
    )
  );
}
