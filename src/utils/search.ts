import type { Ticket } from '../types';

export interface SearchResult {
  ticket: Ticket;
  matchedIn: 'question' | 'answer' | 'tag';
}

function normalize(str: string): string {
  return str.toLowerCase().replace(/ё/g, 'е').trim();
}

export function searchTickets(tickets: Ticket[], query: string): SearchResult[] {
  const trimmed = query.trim();
  if (!trimmed) return tickets.map((t) => ({ ticket: t, matchedIn: 'question' }));

  // Поиск по номеру билета: "3" → 3, 30, 31..., "#42" / "№42" → точное совпадение
  const idMatch = trimmed.match(/^[#№]?\s*(\d+)$/);
  if (idMatch) {
    const prefix = idMatch[1];
    const exact = trimmed.startsWith('#') || trimmed.startsWith('№');
    if (exact) {
      const id = parseInt(prefix, 10);
      const found = tickets.find((t) => t.id === id);
      return found ? [{ ticket: found, matchedIn: 'question' }] : [];
    }
    // префиксный поиск: "3" → 3, 30, 31, 32, ..., 39
    const matches = tickets.filter((t) => String(t.id).startsWith(prefix));
    matches.sort((a, b) => a.id - b.id);
    return matches.map((t) => ({ ticket: t, matchedIn: 'question' as const }));
  }

  const q = normalize(trimmed);
  const byQuestion: SearchResult[] = [];
  const byTag: SearchResult[] = [];
  const byAnswer: SearchResult[] = [];

  for (const t of tickets) {
    if (normalize(t.question).includes(q)) {
      byQuestion.push({ ticket: t, matchedIn: 'question' });
    } else if (t.tags.some((tag) => normalize(tag).includes(q))) {
      byTag.push({ ticket: t, matchedIn: 'tag' });
    } else if (normalize(t.answer).includes(q)) {
      byAnswer.push({ ticket: t, matchedIn: 'answer' });
    }
  }

  return [...byQuestion, ...byTag, ...byAnswer];
}

export function findAutoRelated(ticket: Ticket, all: Ticket[], limit = 4): Ticket[] {
  const scored = all
    .filter((t) => t.id !== ticket.id)
    .map((t) => {
      let score = 0;
      if (t.category === ticket.category) score += 3;
      const sharedTags = t.tags.filter((tag) => ticket.tags.includes(tag)).length;
      score += sharedTags * 2;
      return { t, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ t }) => t);
  return scored;
}

export function getRelated(ticket: Ticket, all: Ticket[]): Ticket[] {
  if (ticket.related && ticket.related.length > 0) {
    const map = new Map(all.map((t) => [t.id, t]));
    const manual = ticket.related.map((id) => map.get(id)).filter((t): t is Ticket => !!t);
    if (manual.length > 0) return manual;
  }
  return findAutoRelated(ticket, all);
}
