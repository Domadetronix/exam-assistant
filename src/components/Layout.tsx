import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

const titles: Record<string, string> = {
  '/': 'Exam Assistant',
  '/theory': 'Билеты',
  '/test': 'Тестирование',
  '/my-ticket': 'Мой билет',
  '/practice': 'Практика',
  '/settings': 'Настройки'
};

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const title =
    titles[location.pathname] ||
    (location.pathname.startsWith('/practice/') ? 'Справочник' : 'Exam Assistant');

  const isRoot = location.pathname === '/' || titles[location.pathname];

  return (
    <div className="app">
      <header className="app-header">
        {!isRoot && (
          <button className="back-btn" onClick={() => navigate(-1)} aria-label="Назад">
            ←
          </button>
        )}
        <h1>{title}</h1>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <nav className="bottom-nav">
        <NavLink to="/" end>
          <span className="icon">🏠</span>
          <span>Главная</span>
        </NavLink>
        <NavLink to="/theory">
          <span className="icon">📚</span>
          <span>Теория</span>
        </NavLink>
        <NavLink to="/my-ticket">
          <span className="icon">📋</span>
          <span>Мой билет</span>
        </NavLink>
        <NavLink to="/test">
          <span className="icon">🎯</span>
          <span>Тест</span>
        </NavLink>
        <NavLink to="/practice">
          <span className="icon">🛠</span>
          <span>Практика</span>
        </NavLink>
        <NavLink to="/settings">
          <span className="icon">⚙️</span>
          <span>Ещё</span>
        </NavLink>
      </nav>
    </div>
  );
}
