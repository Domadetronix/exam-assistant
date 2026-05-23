import { useRef, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { parseTickets } from '../utils/parser';

export function SettingsPage() {
  const { tickets, practice, replaceTickets, resetAll } = useAppStore();
  const fileInput = useRef<HTMLInputElement>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const onPickFile = () => fileInput.current?.click();

  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = parseTickets(text);
      if (parsed.length === 0) {
        showToast('Не удалось распознать билеты в файле');
        return;
      }
      await replaceTickets(parsed);
      showToast(`Импортировано: ${parsed.length} билетов`);
    } catch {
      showToast('Ошибка чтения файла');
    }
  };

  const onExport = () => {
    const blob = new Blob([JSON.stringify(tickets, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tickets.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const onClear = async () => {
    setConfirmClear(false);
    await resetAll();
    showToast('Данные удалены. Перезагрузка...');
    setTimeout(() => window.location.reload(), 600);
  };

  return (
    <>
      <div className="settings-group">
        <div className="settings-row">
          <div className="label">
            <div className="title">Билетов в базе</div>
            <div className="desc">Загружено в IndexedDB</div>
          </div>
          <div style={{ color: 'var(--primary)', fontWeight: 600 }}>{tickets.length}</div>
        </div>
        <div className="settings-row">
          <div className="label">
            <div className="title">Разделов практики</div>
            <div className="desc">Справочники и шпаргалки</div>
          </div>
          <div style={{ color: 'var(--primary)', fontWeight: 600 }}>{practice.length}</div>
        </div>
      </div>

      <div className="settings-group">
        <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
          <div className="label">
            <div className="title">Импорт билетов</div>
            <div className="desc">
              JSON-массив или текст вида <code>Q: ... / A: ...</code> с заголовками{' '}
              <code># Категория:</code> и <code>## Tags:</code>
            </div>
          </div>
          <button className="btn btn-primary" onClick={onPickFile}>
            Выбрать файл
          </button>
          <input
            ref={fileInput}
            type="file"
            accept=".json,.txt,.md,text/plain,application/json"
            style={{ display: 'none' }}
            onChange={onFileSelected}
          />
        </div>
        <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
          <div className="label">
            <div className="title">Экспорт билетов</div>
            <div className="desc">Скачать текущую базу в JSON</div>
          </div>
          <button className="btn" onClick={onExport}>
            Скачать JSON
          </button>
        </div>
      </div>

      <div className="settings-group">
        <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
          <div className="label">
            <div className="title">Очистить данные приложения</div>
            <div className="desc">
              Удалит cache, IndexedDB, LocalStorage и скачанные материалы. Освободит память
              телефона после экзамена.
            </div>
          </div>
          <button className="btn btn-danger" onClick={() => setConfirmClear(true)}>
            Очистить данные
          </button>
        </div>
      </div>

      <div className="settings-group">
        <div className="settings-row">
          <div className="label">
            <div className="title">Офлайн-режим</div>
            <div className="desc">
              Приложение установлено как PWA и работает без интернета после первого запуска.
            </div>
          </div>
        </div>
      </div>

      {confirmClear && (
        <ConfirmDialog
          title="Удалить все данные?"
          message="Будут удалены билеты, кэш и Service Worker. Действие необратимо."
          confirmText="Удалить"
          danger
          onConfirm={onClear}
          onCancel={() => setConfirmClear(false)}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
