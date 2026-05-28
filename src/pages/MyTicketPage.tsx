import { useMemo, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { TicketCard } from '../components/TicketCard';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { Ticket } from '../types';

export function MyTicketPage() {
  const tickets = useAppStore((s) => s.tickets);
  const myTicket = useAppStore((s) => s.myTicket);
  const clearMyTicket = useAppStore((s) => s.clearMyTicket);
  const [openTicket, setOpenTicket] = useState<Ticket | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const selected = useMemo(() => {
    const map = new Map(tickets.map((t) => [t.id, t]));
    return myTicket
      .map((id) => map.get(id))
      .filter((t): t is Ticket => !!t);
  }, [tickets, myTicket]);

  if (selected.length === 0) {
    return (
      <>
        <div className="empty" style={{ padding: '60px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <p style={{ fontSize: 16, color: 'var(--text)', marginBottom: 8, fontWeight: 600 }}>
            Мой билет пока пуст
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.6 }}>
            На экзамене найдите свой вопрос в разделе <b>Теория</b> и нажмите{' '}
            <span className="ticket-num" style={{ background: 'var(--primary-strong)', color: '#fff' }}>
              + В мой билет
            </span>{' '}
            — он появится здесь, чтобы потом быстро посмотреть только нужные вопросы.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <p style={{ color: 'var(--text-dim)', fontSize: 13, marginBottom: 12 }}>
        Сохранено вопросов: <b>{selected.length}</b>
      </p>

      <div className="list">
        {selected.map((ticket) => (
          <button
            key={ticket.id}
            className="list-item"
            onClick={() => setOpenTicket(ticket)}
          >
            <div className="category">
              <span className="ticket-num">№{ticket.id}</span>
              <span>{ticket.category}</span>
            </div>
            <div className="question">{ticket.question}</div>
          </button>
        ))}
      </div>

      <button
        className="btn btn-ghost"
        style={{ marginTop: 20 }}
        onClick={() => setConfirmClear(true)}
      >
        Очистить мой билет
      </button>

      {openTicket && (
        <TicketCard
          ticket={openTicket}
          onClose={() => setOpenTicket(null)}
          onOpen={(t) => setOpenTicket(t)}
        />
      )}

      {confirmClear && (
        <ConfirmDialog
          title="Очистить мой билет?"
          message="Все сохранённые вопросы будут удалены из этого списка. Сами билеты в разделе «Теория» останутся."
          confirmText="Очистить"
          danger
          onConfirm={() => {
            void clearMyTicket();
            setConfirmClear(false);
          }}
          onCancel={() => setConfirmClear(false)}
        />
      )}
    </>
  );
}
