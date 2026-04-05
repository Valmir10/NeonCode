/**
 * Cyberpunk-themed syntax highlighter.
 * Tokenizes code and returns spans with CSS classes for coloring.
 * Supports JavaScript, TypeScript, Python, HTML, and CSS.
 */

export type TokenType =
  | 'keyword'
  | 'string'
  | 'number'
  | 'comment'
  | 'type'
  | 'function'
  | 'operator'
  | 'punctuation'
  | 'variable'
  | 'tag'
  | 'attribute'
  | 'property'
  | 'plain';

export interface Token {
  type: TokenType;
  value: string;
}

const JS_KEYWORDS = new Set([
  'const',
  'let',
  'var',
  'function',
  'return',
  'if',
  'else',
  'for',
  'while',
  'do',
  'switch',
  'case',
  'break',
  'continue',
  'new',
  'this',
  'class',
  'extends',
  'import',
  'export',
  'from',
  'default',
  'async',
  'await',
  'try',
  'catch',
  'throw',
  'typeof',
  'instanceof',
  'in',
  'of',
  'true',
  'false',
  'null',
  'undefined',
  'void',
  'delete',
  'yield',
  'static',
  'super',
  'constructor',
]);

const TS_KEYWORDS = new Set([
  ...JS_KEYWORDS,
  'interface',
  'type',
  'enum',
  'implements',
  'readonly',
  'abstract',
  'declare',
  'namespace',
  'module',
  'as',
  'is',
  'keyof',
  'never',
  'unknown',
  'any',
]);

const PY_KEYWORDS = new Set([
  'def',
  'class',
  'return',
  'if',
  'elif',
  'else',
  'for',
  'while',
  'break',
  'continue',
  'import',
  'from',
  'as',
  'try',
  'except',
  'finally',
  'raise',
  'with',
  'yield',
  'lambda',
  'pass',
  'and',
  'or',
  'not',
  'in',
  'is',
  'True',
  'False',
  'None',
  'self',
  'async',
  'await',
  'print',
  'range',
  'len',
  'str',
  'int',
  'float',
  'list',
  'dict',
  'set',
  'tuple',
]);

const TYPE_WORDS = new Set([
  'string',
  'number',
  'boolean',
  'object',
  'Array',
  'Promise',
  'void',
  'any',
  'never',
  'unknown',
  'Record',
  'Partial',
  'Required',
  'Readonly',
]);

function getKeywords(language: string): Set<string> {
  switch (language) {
    case 'TypeScript':
      return TS_KEYWORDS;
    case 'Python':
      return PY_KEYWORDS;
    default:
      return JS_KEYWORDS;
  }
}

export function tokenize(code: string, language: string): Token[] {
  const tokens: Token[] = [];
  const keywords = getKeywords(language);
  let i = 0;

  while (i < code.length) {
    // Single-line comments
    if (
      (code[i] === '/' && code[i + 1] === '/') ||
      (language === 'Python' && code[i] === '#')
    ) {
      const end = code.indexOf('\n', i);
      const commentEnd = end === -1 ? code.length : end;
      tokens.push({ type: 'comment', value: code.slice(i, commentEnd) });
      i = commentEnd;
      continue;
    }

    // Multi-line comments
    if (code[i] === '/' && code[i + 1] === '*') {
      const end = code.indexOf('*/', i + 2);
      const commentEnd = end === -1 ? code.length : end + 2;
      tokens.push({ type: 'comment', value: code.slice(i, commentEnd) });
      i = commentEnd;
      continue;
    }

    // Strings
    if (code[i] === '"' || code[i] === "'" || code[i] === '`') {
      const quote = code[i];
      let j = i + 1;
      while (j < code.length && code[j] !== quote) {
        if (code[j] === '\\') j++;
        j++;
      }
      tokens.push({ type: 'string', value: code.slice(i, j + 1) });
      i = j + 1;
      continue;
    }

    // HTML tags (for HTML language)
    if (language === 'HTML' && code[i] === '<') {
      const end = code.indexOf('>', i);
      if (end !== -1) {
        tokens.push({ type: 'tag', value: code.slice(i, end + 1) });
        i = end + 1;
        continue;
      }
    }

    // Numbers
    if (/[0-9]/.test(code[i])) {
      let j = i;
      while (j < code.length && /[0-9.]/.test(code[j])) j++;
      tokens.push({ type: 'number', value: code.slice(i, j) });
      i = j;
      continue;
    }

    // Words (identifiers/keywords)
    if (/[a-zA-Z_$]/.test(code[i])) {
      let j = i;
      while (j < code.length && /[a-zA-Z0-9_$]/.test(code[j])) j++;
      const word = code.slice(i, j);

      if (keywords.has(word)) {
        tokens.push({ type: 'keyword', value: word });
      } else if (TYPE_WORDS.has(word) || /^[A-Z][a-zA-Z]+$/.test(word)) {
        tokens.push({ type: 'type', value: word });
      } else if (j < code.length && code[j] === '(') {
        tokens.push({ type: 'function', value: word });
      } else {
        tokens.push({ type: 'variable', value: word });
      }
      i = j;
      continue;
    }

    // Operators
    if (/[+\-*/%=<>!&|^~?:]/.test(code[i])) {
      let j = i;
      while (j < code.length && /[+\-*/%=<>!&|^~?:]/.test(code[j])) j++;
      tokens.push({ type: 'operator', value: code.slice(i, j) });
      i = j;
      continue;
    }

    // Punctuation
    if (/[{}()[\],;.]/.test(code[i])) {
      tokens.push({ type: 'punctuation', value: code[i] });
      i++;
      continue;
    }

    // Whitespace and other
    tokens.push({ type: 'plain', value: code[i] });
    i++;
  }

  return tokens;
}
