import { useParams } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Markdown } from '../components/Markdown';

export function PracticeCategoryPage() {
  const { id } = useParams<{ id: string }>();
  const category = useAppStore((s) => s.practice.find((p) => p.id === id));

  if (!category) {
    return <div className="empty">Категория не найдена</div>;
  }

  return (
    <>
      <h2 style={{ marginTop: 0, fontSize: 22 }}>
        {category.icon} {category.title}
      </h2>
      <p style={{ color: 'var(--text-dim)', fontSize: 14, marginTop: -4, marginBottom: 16 }}>
        {category.description}
      </p>

      {category.sections.map((s) => (
        <div key={s.id} className="practice-section">
          <div className="section-title">{s.title}</div>
          <Markdown source={s.content} />
        </div>
      ))}
    </>
  );
}
