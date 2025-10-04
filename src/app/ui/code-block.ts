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
  const content = snippet.trim().replaceAll(/\\/g, "");
  const normalized = languageAliases[language] ?? language;
  const grammar = Prism.languages[normalized];
  const highlighted = grammar
    ? Prism.highlight(content, grammar, normalized)
    : escapeHtml(content);

  return pre(
    {
      className: "bg-vc-code-bg text-vc-code-text rounded-vc-card p-5 overflow-x-auto my-6 font-mono text-sm leading-relaxed border border-vc-border",
    },
    code(
      {
        innerHTML: highlighted,
        className: "font-mono",
      }
    )
  );
}
