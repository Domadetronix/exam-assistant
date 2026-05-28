import { useMemo, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { searchTickets } from '../utils/search';
import { TicketCard } from '../components/TicketCard';
import type { Ticket } from '../types';

export function TheoryPage() {
  const tickets = useAppStore((s) => s.tickets);
  const myTicket = useAppStore((s) => s.myTicket);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('Все');
  const [openTicket, setOpenTicket] = useState<Ticket | null>(null);
  const mySet = new Set(myTicket);

  const categories = useMemo(() => {
    const set = new Set<string>();
    tickets.forEach((t) => set.add(t.category));
    return ['Все', ...Array.from(set).sort()];
  }, [tickets]);

  const filtered = useMemo(() => {
    const byCat = category === 'Все' ? tickets : tickets.filter((t) => t.category === category);
    return searchTickets(byCat, query);
  }, [tickets, query, category]);

  return (
    <>
      <div className="search-bar">
        <span aria-hidden>🔍</span>
        <input
          type="search"
          placeholder="Поиск: текст или № билета (например, 42)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button className="clear" onClick={() => setQuery('')} aria-label="Очистить">
            ✕
          </button>
        )}
      </div>

      <div className="chips">
        {categories.map((c) => (
          <button
            key={c}
            className={`chip ${c === category ? 'active' : ''}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <p>Ничего не найдено</p>
        </div>
      ) : (
        <div className="list">
          {filtered.map(({ ticket, matchedIn }) => (
            <button
              key={ticket.id}
              className="list-item"
              onClick={() => setOpenTicket(ticket)}
            >
              <div className="category">
                <span className="ticket-num">№{ticket.id}</span>
                <span>{ticket.category}</span>
                {mySet.has(ticket.id) && (
                  <span className="my-ticket-badge" aria-label="В моём билете">★</span>
                )}
              </div>
              <div className="question">{ticket.question}</div>
              {matchedIn === 'answer' && (
                <div className="preview">{ticket.answer}</div>
              )}
            </button>
          ))}
        </div>
      )}

      {openTicket && (
        <TicketCard
          ticket={openTicket}
          onClose={() => setOpenTicket(null)}
          onOpen={(t) => setOpenTicket(t)}
        />
      )}
    </>
  );
}
