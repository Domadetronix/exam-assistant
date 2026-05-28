import { useCallback, useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { Ticket } from '../types';

function pickRandom<T>(arr: T[], avoid?: T): T {
  if (arr.length <= 1) return arr[0];
  let pick = arr[Math.floor(Math.random() * arr.length)];
  let guard = 0;
  while (pick === avoid && guard < 10) {
    pick = arr[Math.floor(Math.random() * arr.length)];
    guard++;
  }
  return pick;
}

export function TestPage() {
  const tickets = useAppStore((s) => s.tickets);
  const myTicket = useAppStore((s) => s.myTicket);
  const toggleMyTicket = useAppStore((s) => s.toggleMyTicket);
  const [current, setCurrent] = useState<Ticket | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [askConfirm, setAskConfirm] = useState(false);
  const inMyTicket = current ? myTicket.includes(current.id) : false;

  const next = useCallback(() => {
    if (tickets.length === 0) return;
    setCurrent((prev) => pickRandom(tickets, prev ?? undefined));
    setRevealed(false);
  }, [tickets]);

  useEffect(() => {
    if (!current) next();
  }, [current, next]);

  if (!current) {
    return <div className="empty">Нет вопросов для теста</div>;
  }

  return (
    <>
      <p style={{ color: 'var(--text-dim)', fontSize: 13 }}>
        Быстрое самотестирование — случайный вопрос из {tickets.length}.
      </p>

      <div className="test-card">
        <div className="ticket-num-big">Билет №{current.id}</div>
        <div className="category" style={{ color: 'var(--primary)', fontSize: 11, textTransform: 'uppercase', marginBottom: 8, fontWeight: 600 }}>
          {current.category}
        </div>
        <div className="question">{current.question}</div>

        <div className={`answer-wrap ${revealed ? '' : 'blurred'}`}>
          <div className="answer-text">{current.answer}</div>
          {!revealed && (
            <button className="reveal-btn" onClick={() => setAskConfirm(true)}>
              <span className="lock">🔒</span>
              <span>Показать ответ</span>
            </button>
          )}
        </div>

        <div className="test-actions">
          <button
            className={inMyTicket ? 'btn btn-ghost' : 'btn btn-primary'}
            onClick={() => current && void toggleMyTicket(current.id)}
          >
            {inMyTicket ? '✓ В моём билете' : '＋ В мой билет'}
          </button>
          <button className="btn" onClick={next}>
            Следующий
          </button>
        </div>
      </div>

      {askConfirm && (
        <ConfirmDialog
          title="Показать ответ?"
          message="Подумайте над вопросом сначала — это часть подготовки."
          confirmText="Показать"
          onConfirm={() => {
            setRevealed(true);
            setAskConfirm(false);
          }}
          onCancel={() => setAskConfirm(false)}
        />
      )}
    </>
  );
}
