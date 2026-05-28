import { useEffect } from 'react';
import type { Ticket } from '../types';
import { useAppStore } from '../store/useAppStore';
import { getRelated } from '../utils/search';

interface Props {
  ticket: Ticket;
  onClose: () => void;
  onOpen: (t: Ticket) => void;
}

export function TicketCard({ ticket, onClose, onOpen }: Props) {
  const tickets = useAppStore((s) => s.tickets);
  const myTicket = useAppStore((s) => s.myTicket);
  const toggleMyTicket = useAppStore((s) => s.toggleMyTicket);
  const related = getRelated(ticket, tickets);
  const inMyTicket = myTicket.includes(ticket.id);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-header">
          <span className="ticket-num">№{ticket.id}</span>
          <div className="category">{ticket.category}</div>
          <button className="close" onClick={onClose} aria-label="Закрыть">
            ✕
          </button>
        </div>
        <h2>{ticket.question}</h2>

        <button
          className={inMyTicket ? 'btn btn-ghost' : 'btn btn-primary'}
          style={{ marginBottom: 14 }}
          onClick={() => void toggleMyTicket(ticket.id)}
        >
          {inMyTicket ? '✓ В моём билете — убрать' : '＋ В мой билет'}
        </button>

        <div className="answer">{ticket.answer}</div>

        {ticket.tags.length > 0 && (
          <div className="tags">
            {ticket.tags.map((t) => (
              <span className="tag" key={t}>
                #{t}
              </span>
            ))}
          </div>
        )}

        {related.length > 0 && (
          <>
            <div className="related-title">Связанные вопросы</div>
            <div className="list">
              {related.map((r) => (
                <button key={r.id} className="list-item" onClick={() => onOpen(r)}>
                  <div className="category">
                    <span className="ticket-num">№{r.id}</span>
                    <span>{r.category}</span>
                  </div>
                  <div className="question">{r.question}</div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
