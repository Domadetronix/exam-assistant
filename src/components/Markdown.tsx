/**
 * Минимальный безопасный markdown-рендерер: заголовки, списки, code-блоки,
 * inline-код, жирный/курсив, ссылки, таблицы. Использует только React-узлы —
 * никакого dangerouslySet... — поэтому XSS-безопасен по построению.
 */

type Node =
  | { type: 'text'; value: string }
  | { type: 'code'; value: string }
  | { type: 'bold'; children: Node[] }
  | { type: 'italic'; children: Node[] }
  | { type: 'link'; href: string; children: Node[] };

function parseInline(text: string): Node[] {
  const nodes: Node[] = [];
  let i = 0;
  let buf = '';
  const flush = () => {
    if (buf) {
      nodes.push({ type: 'text', value: buf });
      buf = '';
    }
  };

  while (i < text.length) {
    const ch = text[i];

    if (ch === '`') {
      const end = text.indexOf('`', i + 1);
      if (end !== -1) {
        flush();
        nodes.push({ type: 'code', value: text.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }

    if (ch === '*' && text[i + 1] === '*') {
      const end = text.indexOf('**', i + 2);
      if (end !== -1) {
        flush();
        nodes.push({ type: 'bold', children: parseInline(text.slice(i + 2, end)) });
        i = end + 2;
        continue;
      }
    }

    if (ch === '*') {
      const end = text.indexOf('*', i + 1);
      if (end !== -1) {
        flush();
        nodes.push({ type: 'italic', children: parseInline(text.slice(i + 1, end)) });
        i = end + 1;
        continue;
      }
    }

    if (ch === '[') {
      const close = text.indexOf(']', i + 1);
      if (close !== -1 && text[close + 1] === '(') {
        const endP = text.indexOf(')', close + 2);
        if (endP !== -1) {
          flush();
          nodes.push({
            type: 'link',
            href: text.slice(close + 2, endP),
            children: parseInline(text.slice(i + 1, close))
          });
          i = endP + 1;
          continue;
        }
      }
    }

    buf += ch;
    i++;
  }
  flush();
  return nodes;
}

function renderInline(nodes: Node[], keyBase: string): React.ReactNode {
  return nodes.map((n, i) => {
    const key = `${keyBase}-${i}`;
    if (n.type === 'text') return <span key={key}>{n.value}</span>;
    if (n.type === 'code') return <code key={key}>{n.value}</code>;
    if (n.type === 'bold') return <strong key={key}>{renderInline(n.children, key)}</strong>;
    if (n.type === 'italic') return <em key={key}>{renderInline(n.children, key)}</em>;
    if (n.type === 'link') {
      const safe = /^(https?:|mailto:|tel:|\/)/i.test(n.href) ? n.href : '#';
      return (
        <a key={key} href={safe} target="_blank" rel="noopener noreferrer">
          {renderInline(n.children, key)}
        </a>
      );
    }
    return null;
  });
}

export function Markdown({ source }: { source: string }) {
  const lines = source.split(/\r?\n/);
  const blocks: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      blocks.push(
        <pre key={`pre-${blocks.length}`} data-lang={lang}>
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
      continue;
    }

    const h = line.match(/^(#{1,4})\s+(.+)$/);
    if (h) {
      const level = h[1].length;
      const content = renderInline(parseInline(h[2]), `h-${blocks.length}`);
      const Tag = `h${Math.min(level + 1, 6)}` as keyof JSX.IntrinsicElements;
      blocks.push(<Tag key={`h-${blocks.length}`}>{content}</Tag>);
      i++;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ''));
        i++;
      }
      blocks.push(
        <ul key={`ul-${blocks.length}`}>
          {items.map((it, idx) => (
            <li key={idx}>{renderInline(parseInline(it), `li-${idx}`)}</li>
          ))}
        </ul>
      );
      continue;
    }

    const olMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (olMatch) {
      const startNum = parseInt(olMatch[1], 10);
      const items: string[] = [olMatch[2]];
      i++;
      while (i < lines.length) {
        const next = lines[i].match(/^(\d+)\.\s+(.*)$/);
        if (next) {
          items.push(next[2]);
          i++;
        } else {
          break;
        }
      }
      blocks.push(
        <ol key={`ol-${blocks.length}`} start={startNum}>
          {items.map((it, idx) => (
            <li key={idx}>{renderInline(parseInline(it), `oli-${idx}`)}</li>
          ))}
        </ol>
      );
      continue;
    }

    if (line.includes('|') && lines[i + 1] && /^\|?\s*:?-+/.test(lines[i + 1])) {
      const header = line
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes('|')) {
        const raw = lines[i].split('|').map((s) => s.trim());
        if (raw[0] === '') raw.shift();
        if (raw[raw.length - 1] === '') raw.pop();
        rows.push(raw);
        i++;
      }
      blocks.push(
        <table key={`t-${blocks.length}`}>
          <thead>
            <tr>
              {header.map((h2, idx) => (
                <th key={idx}>{renderInline(parseInline(h2), `th-${idx}`)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri}>
                {r.map((c, ci) => (
                  <td key={ci}>{renderInline(parseInline(c), `td-${ri}-${ci}`)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
      continue;
    }

    if (!line.trim()) {
      i++;
      continue;
    }

    const para: string[] = [line];
    i++;
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|[-*]\s|\d+\.\s|```)/.test(lines[i])) {
      para.push(lines[i]);
      i++;
    }
    blocks.push(
      <p key={`p-${blocks.length}`}>
        {renderInline(parseInline(para.join(' ')), `p-${blocks.length}`)}
      </p>
    );
  }

  return <div className="markdown">{blocks}</div>;
}
