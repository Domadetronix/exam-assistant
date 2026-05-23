import type { Ticket } from '../types';

/**
 * Парсер текстового документа в массив билетов.
 *
 * Поддерживаемые форматы:
 *
 * 1) JSON-массив объектов Ticket (если документ начинается с "[").
 *
 * 2) Markdown / plain text вида:
 *
 *    # Категория: Теория цвета
 *    ## Tags: цвет, дизайн
 *
 *    Q: Что такое цветовой круг?
 *    A: Цветовой круг — это...
 *
 *    Q: Какие бывают цветовые схемы?
 *    A: Монохромная, аналоговая...
 *
 *    Категория и теги действуют до следующего объявления.
 */

const CATEGORY_RE = /^#\s*(?:Категория|Category)\s*:\s*(.+)$/i;
const TAGS_RE = /^##\s*(?:Tags|Теги)\s*:\s*(.+)$/i;
const Q_RE = /^(?:Q|В|Вопрос)\s*[:.)]\s*(.+)$/i;
const A_RE = /^(?:A|О|Ответ)\s*[:.)]\s*(.+)$/i;

export function parseTickets(raw: string): Ticket[] {
  const trimmed = raw.trim();
  if (trimmed.startsWith('[')) {
    try {
      const arr = JSON.parse(trimmed) as Ticket[];
      return arr.map((t, i) => ({ ...t, id: t.id ?? i + 1 }));
    } catch {
      // продолжаем парсить как текст
    }
  }

  const lines = trimmed.split(/\r?\n/);
  const tickets: Ticket[] = [];
  let id = 1;
  let category = 'Без категории';
  let tags: string[] = [];
  let currentQ: string | null = null;
  let currentA: string[] = [];
  let mode: 'q' | 'a' | null = null;

  const flush = () => {
    if (currentQ) {
      tickets.push({
        id: id++,
        category,
        tags: [...tags],
        question: currentQ.trim(),
        answer: currentA.join('\n').trim()
      });
    }
    currentQ = null;
    currentA = [];
    mode = null;
  };

  for (const line of lines) {
    const catMatch = line.match(CATEGORY_RE);
    if (catMatch) {
      flush();
      category = catMatch[1].trim();
      continue;
    }
    const tagMatch = line.match(TAGS_RE);
    if (tagMatch) {
      flush();
      tags = tagMatch[1]
        .split(/[,;]/)
        .map((s) => s.trim())
        .filter(Boolean);
      continue;
    }
    const qMatch = line.match(Q_RE);
    if (qMatch) {
      flush();
      currentQ = qMatch[1].trim();
      mode = 'q';
      continue;
    }
    const aMatch = line.match(A_RE);
    if (aMatch) {
      currentA = [aMatch[1].trim()];
      mode = 'a';
      continue;
    }
    if (mode === 'q' && currentQ && line.trim()) {
      currentQ += ' ' + line.trim();
    } else if (mode === 'a' && line.trim()) {
      currentA.push(line);
    }
  }
  flush();
  return tickets;
}
