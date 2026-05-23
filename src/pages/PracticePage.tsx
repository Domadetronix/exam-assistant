import { Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export function PracticePage() {
  const practice = useAppStore((s) => s.practice);

  return (
    <div className="tiles">
      {practice.map((p) => (
        <Link key={p.id} to={`/practice/${p.id}`} className="tile">
          <span className="icon">{p.icon}</span>
          <div>
            <div className="title">{p.title}</div>
            <div className="subtitle">{p.description}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
