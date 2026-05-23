import { Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export function HomePage() {
  const tickets = useAppStore((s) => s.tickets);
  const practice = useAppStore((s) => s.practice);

  return (
    <>
      <section className="home-hero">
        <h2>Подготовка к экзамену</h2>
        <p>Билеты, тесты и практические шпаргалки в одном офлайн-приложении.</p>
      </section>

      <div className="tiles">
        <Link to="/theory" className="tile">
          <span className="icon">📚</span>
          <div>
            <div className="title">Теория</div>
            <div className="subtitle">{tickets.length} билетов</div>
          </div>
        </Link>

        <Link to="/test" className="tile">
          <span className="icon">🎯</span>
          <div>
            <div className="title">Тест</div>
            <div className="subtitle">Случайный вопрос</div>
          </div>
        </Link>

        <Link to="/practice" className="tile">
          <span className="icon">🛠</span>
          <div>
            <div className="title">Практика</div>
            <div className="subtitle">{practice.length} направлений</div>
          </div>
        </Link>

        <Link to="/settings" className="tile">
          <span className="icon">⚙️</span>
          <div>
            <div className="title">Настройки</div>
            <div className="subtitle">Импорт, очистка</div>
          </div>
        </Link>
      </div>
    </>
  );
}
